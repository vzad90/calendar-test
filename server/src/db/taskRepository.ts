import { getSql } from './client.js';
import { rowToTask, type Task, type TaskRow } from '../types/task.js';

export async function findTasksInRange(from: string, to: string): Promise<Task[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, title, date::text as date, order_index, created_at, updated_at
    FROM tasks
    WHERE date >= ${from}::date AND date <= ${to}::date
    ORDER BY date ASC, order_index ASC
  `;
  return (rows as TaskRow[]).map(rowToTask);
}

export async function findTaskById(id: number): Promise<Task | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, title, date::text as date, order_index, created_at, updated_at
    FROM tasks WHERE id = ${id}
  `) as TaskRow[];
  return rows.length ? rowToTask(rows[0]) : null;
}

export async function createTask(title: string, date: string): Promise<Task> {
  const sql = getSql();
  const maxResult = (await sql`
    SELECT COALESCE(MAX(order_index), 0) + 1 as next FROM tasks WHERE date = ${date}::date
  `) as { next: string }[];
  const orderIndex = Number(maxResult[0]?.next) || 1;
  const rows = (await sql`
    INSERT INTO tasks (title, date, order_index)
    VALUES (${title}, ${date}::date, ${orderIndex})
    RETURNING id, title, date::text as date, order_index, created_at, updated_at
  `) as TaskRow[];
  return rowToTask(rows[0]);
}

export async function updateTask(
  id: number,
  data: { title?: string; date?: string; order?: number }
): Promise<Task | null> {
  const current = await findTaskById(id);
  if (!current) return null;
  const title = data.title ?? current.title;
  const date = data.date ?? current.date;
  const order = data.order ?? current.order;
  const sql = getSql();
  const rows = (await sql`
    UPDATE tasks
    SET title = ${title}, date = ${date}::date, order_index = ${order}, updated_at = now()
    WHERE id = ${id}
    RETURNING id, title, date::text as date, order_index, created_at, updated_at
  `) as TaskRow[];
  return rows.length ? rowToTask(rows[0]) : null;
}

export async function deleteTask(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`DELETE FROM tasks WHERE id = ${id} RETURNING id`) as { id: number }[];
  return rows.length > 0;
}
