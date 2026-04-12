import { useCallback, useEffect, useMemo, useState } from 'react';

import { ISO, fromISO, isSameDay } from './dateUtils';
import type { Task } from './types';

const STORAGE_KEY = 'planner:tasks:v1';

function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    return parsed.map((t, i) => ({ ...t, order: t.order ?? i }));
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((input: Omit<Task, 'id' | 'done' | 'createdAt' | 'order'>) => {
    setTasks((prev) => [
      ...prev,
      {
        id: uid(),
        done: false,
        createdAt: new Date().toISOString(),
        order: prev.length,
        ...input,
      },
    ]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const reorder = useCallback((ids: string[]) => {
    setTasks((prev) => {
      const index = new Map(ids.map((id, i) => [id, i]));
      return prev.map((t) => (index.has(t.id) ? { ...t, order: index.get(t.id)! } : t));
    });
  }, []);

  const rolloverPendingTo = useCallback((targetISO: string) => {
    const targetDate = fromISO(targetISO);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.done || !t.date) return t;
        const taskDate = fromISO(t.date);
        if (taskDate < targetDate && !isSameDay(taskDate, targetDate)) {
          return { ...t, date: targetISO };
        }
        return t;
      }),
    );
  }, []);

  const byDay = useCallback(
    (date: Date) => {
      const iso = ISO(date);
      return tasks
        .filter((t) => t.date === iso)
        .sort(
          (a, b) =>
            Number(a.done) - Number(b.done) ||
            (a.time ?? 'zz').localeCompare(b.time ?? 'zz') ||
            a.order - b.order,
        );
    },
    [tasks],
  );

  const undatedTasks = useMemo(
    () => tasks.filter((t) => !t.date).sort((a, b) => a.order - b.order),
    [tasks],
  );

  const pendingBefore = useCallback(
    (date: Date) => {
      const iso = ISO(date);
      return tasks.filter((t) => !t.done && t.date && t.date < iso);
    },
    [tasks],
  );

  return {
    tasks,
    addTask,
    updateTask,
    removeTask,
    toggleDone,
    reorder,
    rolloverPendingTo,
    byDay,
    undatedTasks,
    pendingBefore,
  };
}

export type UseTasks = ReturnType<typeof useTasks>;
