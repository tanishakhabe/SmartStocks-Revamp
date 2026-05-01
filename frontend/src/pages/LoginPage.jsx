import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin?.(email);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800 p-8 shadow-xl">
        <h1 className="text-center text-2xl font-semibold text-white">
          Sign in to <span className="text-blue-500">SmartStocks</span>
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Recommendations powered by your preferences.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-white outline-none ring-blue-500/30 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-white outline-none ring-blue-500/30 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          No account?{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
