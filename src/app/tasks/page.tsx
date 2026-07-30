import type { Metadata } from 'next';
import TasksClient from './tasks-client';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'View your tasks and their current status.',
};

export default function TasksPage() {
  return (
    <main className='min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <header className='mb-8'>
          <p className='text-sm font-semibold uppercase tracking-wider text-blue-600'>
            Todo app
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl'>
            Your tasks
          </h1>
          <p className='mt-2 text-slate-600'>
            Keep track of what is finished and what still needs your attention.
          </p>
        </header>

        <TasksClient />
      </div>
    </main>
  );
}
