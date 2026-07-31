'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface Task {
  taskId: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface TasksContextValue {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;

  const task = value as Record<string, unknown>;
  return typeof task.taskId === 'string' && typeof task.title === 'string';
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to load tasks.';
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  if (!apiUrl) {
    throw new Error('The task API is not configured.');
  }

  const loadTasks = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);

      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.replace('/login');
          return;
        }

        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/tasks`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          signal,
        });

        if (response.status === 401 || response.status === 403) {
          alert('Your session has ended. Please re-login to continue.');
          sessionStorage.removeItem('accessToken');
          router.replace('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Unable to load tasks (${response.status}).`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isTask)) {
          throw new Error('The task API returned an unexpected response.');
        }

        setTasks(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setError(getErrorMessage(error));
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [router, apiUrl],
  );

  const toggleTaskCompletion = useCallback(
    async (taskId: string) => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.replace('/login');
          return;
        }

        const response = await fetch(
          `${apiUrl.replace(/\/$/, '')}/tasks/toggleCompletion`,
          {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              id: taskId,
            }),
          },
        );

        if (response.status === 401 || response.status === 403) {
          alert('Your session has ended. Please re-login to continue.');
          sessionStorage.removeItem('accessToken');
          router.replace('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Unable to load tasks (${response.status}).`);
        }

        await loadTasks();

      } catch (error) {
        setError(getErrorMessage(error));
      }
    },
    [router, apiUrl, loadTasks],
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadTasks(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadTasks]);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      isLoading,
      error,
      refetch: loadTasks,
      toggleTaskCompletion,
    }),
    [tasks, isLoading, error, loadTasks, toggleTaskCompletion],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export default function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider.');
  }

  return context;
}
