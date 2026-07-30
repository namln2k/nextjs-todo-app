'use client';

import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const session = await login(email, password);
      if (session && typeof session.AccessToken !== 'undefined') {
        if (sessionStorage.getItem('accessToken')) {
          router.replace('/tasks');
        } else {
          console.error('Session token was not set properly.');
        }
      } else {
        console.error('Login session or AccessToken is undefined.');
      }
    } catch (error) {
      alert(`Login failed: ${error}`);
    }
  };

  return (
    <main className='bg-gray-50 px-4 md:px-8'>
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className='max-w-md w-full'>
          <div className='p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8'>
            <h1 className='text-slate-900 text-center text-3xl font-bold'>
              Sign in
            </h1>

            <form className='space-y-6 mt-10' onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor='email'
                  className='mb-2 text-slate-900 font-medium text-sm inline-block'
                >
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Email'
                  required
                  className='px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='mb-2 text-slate-900 font-medium text-sm inline-block'
                >
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  required
                  className='px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600'
                />
              </div>

              <div className='flex items-start flex-wrap gap-2'>
                <a
                  href='#'
                  className='ml-auto text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
                >
                  Forgot password?
                </a>
              </div>

              <button
                type='submit'
                className='w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              >
                Sign in
              </button>

              <div className='text-slate-900 text-sm text-center'>
                Don&apos;t have an account?{' '}
                <a
                  href='#'
                  className='text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
                >
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
