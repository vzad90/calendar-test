import { useState, useEffect, useCallback } from 'react';
import * as tasksApi from '../api/tasks';
import type { Task } from '../types/task';

export function useTasks(from: string, to: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getTasks(from, to);
      setTasks(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  /** Refetch without setting loading — use after drag to sync state without UI flash */
  const refetchSilent = useCallback(async () => {
    try {
      const data = await tasksApi.getTasks(from, to);
      setTasks(data);
    } catch {
      // keep current state on error
    }
  }, [from, to]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(
    async (title: string, date: string) => {
      const task = await tasksApi.createTask(title, date);
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.date === date ? { ...t, order: t.order + 1 } : t
        );
        return [...updated, task].sort((a, b) =>
          a.date === b.date ? a.order - b.order : a.date.localeCompare(b.date)
        );
      });
      return task;
    },
    []
  );

  const update = useCallback(
    async (id: number, data: { title?: string; date?: string; order?: number }) => {
      const task = await tasksApi.updateTask(id, data);
      setTasks((prev) =>
        prev
          .filter((t) => t.id !== id)
          .concat(task)
          .sort((a, b) => (a.date === b.date ? a.order - b.order : a.date.localeCompare(b.date)))
      );
      return task;
    },
    []
  );

  const remove = useCallback(async (id: number) => {
    await tasksApi.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, refetch, refetchSilent, create, update, remove };
}
