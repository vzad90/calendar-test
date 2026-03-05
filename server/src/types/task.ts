export type Task = {
  id: number;
  title: string;
  date: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type TaskRow = {
  id: number;
  title: string;
  date: string;
  order_index: number;
  created_at: string | Date;
  updated_at: string | Date;
};

export function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    order: row.order_index,
    createdAt: typeof row.created_at === 'string' ? row.created_at : row.created_at.toISOString(),
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : row.updated_at.toISOString(),
  };
}
