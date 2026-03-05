import { request } from './client';
import type { Task } from '../types/task';

export function getTasks(from: string, to: string): Promise<Task[]> {
  return request<Task[]>(`/api/tasks?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

export function createTask(title: string, date: string): Promise<Task> {
  return request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, date }),
  });
}

export function updateTask(
  id: number,
  data: { title?: string; date?: string; order?: number }
): Promise<Task> {
  return request<Task>(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id: number): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: 'DELETE' });
}
