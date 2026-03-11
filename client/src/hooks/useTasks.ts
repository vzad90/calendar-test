import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tasksApi from '../api/tasks';
import type { TaskReorderUpdate } from '../api/tasks';
import type { Task } from '../types/task';

function sortTasksByDateAndOrder(list: Task[]): Task[] {
  return [...list].sort((a, b) =>
    a.date === b.date ? a.order - b.order : a.date.localeCompare(b.date)
  );
}

export function useTasks(from: string, to: string) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['tasks', from, to] as const, [from, to]);

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Task[]>({
    queryKey,
    queryFn: async () => {
      const data = await tasksApi.getTasks(from, to);
      return sortTasksByDateAndOrder(data);
    },
  });

  const refetchSilent = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const createMutation = useMutation({
    mutationFn: ({ title, date }: { title: string; date: string }) =>
      tasksApi.createTask(title, date),
    onMutate: async ({ title, date }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey) ?? [];
      const optimisticId = Math.min(0, ...previous.map((t) => t.id)) - 1;
      const optimisticTask: Task = {
        id: optimisticId,
        title,
        date,
        order: previous.filter((t) => t.date === date).length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Task[]>(queryKey, (prev = []) =>
        sortTasksByDateAndOrder([...prev, optimisticTask])
      );
      return { previous, optimisticId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (task, _vars, context) => {
      queryClient.setQueryData<Task[]>(queryKey, (prev = []) =>
        sortTasksByDateAndOrder(
          prev.filter((t) => t.id !== context?.optimisticId).concat(task)
        )
      );
    },
  });

  const create = useCallback(
    (title: string, date: string) => createMutation.mutateAsync({ title, date }),
    [createMutation]
  );

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { title?: string; date?: string; order?: number };
    }) => tasksApi.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey) ?? [];
      const existing = previous.find((t) => t.id === id);
      if (!existing) {
        return { previous };
      }
      const optimistic: Task = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      const next = sortTasksByDateAndOrder(
        previous.filter((t) => t.id !== id).concat(optimistic)
      );
      queryClient.setQueryData<Task[]>(queryKey, next);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(queryKey, (prev = []) =>
        sortTasksByDateAndOrder(prev.filter((t) => t.id !== task.id).concat(task))
      );
    },
  });

  const update = useCallback(
    (id: number, data: { title?: string; date?: string; order?: number }) =>
      updateMutation.mutateAsync({ id, data }),
    [updateMutation]
  );

  const removeMutation = useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey) ?? [];
      const next = previous.filter((t) => t.id !== id);
      queryClient.setQueryData<Task[]>(queryKey, next);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });

  const remove = useCallback(
    (id: number) => removeMutation.mutateAsync(id),
    [removeMutation]
  );

  const reorderMutation = useMutation({
    mutationFn: (updates: TaskReorderUpdate[]) => tasksApi.reorderTasks(updates),
    onMutate: async (updates: TaskReorderUpdate[]) => {
      if (updates.length === 0) return { previous: queryClient.getQueryData<Task[]>(queryKey) ?? [] };
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey) ?? [];
      const byId = new Map<number, TaskReorderUpdate>();
      updates.forEach((u) => {
        byId.set(u.id, u);
      });
      const next = sortTasksByDateAndOrder(
        previous.map((t) => {
          const upd = byId.get(t.id);
          if (!upd) return t;
          return {
            ...t,
            date: upd.date,
            order: upd.order,
          };
        })
      );
      queryClient.setQueryData<Task[]>(queryKey, next);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });

  const reorder = useCallback(
    (updates: TaskReorderUpdate[]) => reorderMutation.mutateAsync(updates),
    [reorderMutation]
  );

  return {
    tasks: data,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    refetchSilent,
    create,
    update,
    remove,
    reorder,
  };
}
