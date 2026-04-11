'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email,
        password,
      })
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      router.push('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      setError('Login failed. Please check your credentials and try again.')
    }
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <section className="glass-panel w-full max-w-5xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="hidden border-r border-[var(--border-soft)] bg-gradient-to-br from-blue-500/20 via-sky-500/5 to-transparent p-8 md:block">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              TicketOps
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Professional ticketing operations, all in one dashboard.
            </h1>
            <p className="page-subtitle">
              Monitor events, manage bookings, and stay in control with a clean
              operational view.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10">
            <h2 className="page-title text-2xl">Sign in</h2>
            <p className="page-subtitle">Welcome back. Enter your credentials.</p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-6 w-full">
              Sign in
            </button>

            <p className="mt-5 text-sm text-[var(--text-secondary)]">
              No account yet?{" "}
              <Link href="/register" className="font-semibold text-blue-300">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage
