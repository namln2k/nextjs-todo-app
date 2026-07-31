'use client';

import useTasks, { TasksProvider } from '@/hooks/useTasks';

function TasksList() {
  const { tasks, isLoading, error, refetch, toggleTaskCompletion } = useTasks();

  if (isLoading) {
    return (
      <div
        className='rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm'
        role='status'
      >
        Loading tasks…
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='rounded-xl border border-red-200 bg-red-50 p-6 text-red-900'
        role='alert'
      >
        <h2 className='font-semibold'>Tasks could not be loaded</h2>
        <p className='mt-1 text-sm'>{error}</p>
        <button
          className='mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2'
          onClick={() => void refetch()}
          type='button'
        >
          Try again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center'>
        <h2 className='text-lg font-semibold text-slate-900'>No tasks yet</h2>
        <p className='mt-1 text-sm text-slate-600'>
          Your tasks will appear here once they have been created.
        </p>
      </div>
    );
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section aria-labelledby='task-list-heading'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h2
          id='task-list-heading'
          className='text-lg font-semibold text-slate-900'
        >
          Task list
        </h2>
        <p className='text-sm text-slate-600'>
          {completedCount} of {tasks.length} completed
        </p>
      </div>

      <ul className='grid gap-4 sm:grid-cols-2'>
        {tasks.map((task) => (
          <li
            key={task.taskId}
            className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'
          >
            <div className='flex items-start justify-between gap-4'>
              <h3 className='font-semibold text-slate-950'>{task.title}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer ${
                  task.completed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
                onClick={() => toggleTaskCompletion(task.taskId)}
              >
                {task.completed ? 'Completed' : 'Incomplete'}
              </span>
            </div>
            {task.description && (
              <p className='mt-3 text-sm leading-6 text-slate-600'>
                {task.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TasksClient() {
  return (
    <TasksProvider>
      <TasksList />
    </TasksProvider>
  );
}
