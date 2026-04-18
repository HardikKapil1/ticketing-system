"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function HandleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/user/register", {
        name,
        email,
        password,
      });
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      console.log(response.data);
      router.push("/login");
    } catch (submitError) {
      console.error("Registration failed:", submitError);
      setError(
        "Registration failed. Please verify your details and try again.",
      );
    }
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <section className="glass-panel w-full max-w-5xl overflow-hidden">
        <div className="auth-grid">
          <div className="auth-showcase hidden md:flex">
            <div className="auth-copy">
              <p className="auth-eyebrow text-cyan-300">TicketOps</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight lg:text-5xl">
                Launch your event workflow in minutes.
              </h1>
              <p className="page-subtitle mt-5 max-w-md">
                Create your account and access a modern control panel for events
                and ticket operations.
              </p>
            </div>

            <div className="auth-kicker">
              <div>
                <p className="text-sm font-semibold text-white">
                  Fast onboarding
                </p>
                <p className="mt-2">
                  Get your team into a clean ticketing workspace in a few steps.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Clear workflows
                </p>
                <p className="mt-2">
                  Move from event setup to booking visibility without context
                  switching.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={HandleSubmit} className="auth-form-panel">
            <div className="auth-form-shell">
              <p className="auth-eyebrow md:hidden">TicketOps</p>
              <h2 className="page-title mt-3 text-2xl">Create account</h2>
              <p className="page-subtitle mt-3">
                Start managing tickets with confidence.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="field-label">Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-dark"
                    required
                  />
                </div>
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
                    placeholder="Create password"
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
                Create account
              </button>

              <p className="mt-6 text-sm text-[var(--text-secondary)]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-300 transition hover:text-blue-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
