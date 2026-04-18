"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../lib/api";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <section className="glass-panel w-full max-w-5xl overflow-hidden">
        <div className="auth-grid">
          <div className="auth-showcase hidden md:flex">
            <div className="auth-copy">
              <p className="auth-eyebrow">TicketOps</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight lg:text-5xl">
                Professional ticketing operations, all in one dashboard.
              </h1>
              <p className="page-subtitle mt-5 max-w-md">
                Monitor events, manage bookings, and stay in control with a
                clean operational view.
              </p>
            </div>

            <div className="auth-kicker">
              <div>
                <p className="text-sm font-semibold text-white">
                  Unified control
                </p>
                <p className="mt-2">
                  Track events, users, and bookings from one workspace.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Live operations
                </p>
                <p className="mt-2">
                  Keep admins and users aligned with a clear ticket flow.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-panel">
            <div className="auth-form-shell">
              <p className="auth-eyebrow md:hidden">TicketOps</p>
              <h2 className="page-title mt-3 text-2xl">Sign in</h2>
              <p className="page-subtitle mt-3">
                Welcome back. Enter your credentials.
              </p>

              <div className="mt-8 space-y-5">
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
                <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary mt-7 w-full">
                Sign in
              </button>

              <p className="mt-6 text-sm text-[var(--text-secondary)]">
                No account yet?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-300 transition hover:text-blue-200"
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
