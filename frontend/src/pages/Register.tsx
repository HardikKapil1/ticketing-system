import axios from "../utils/axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function HandleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/user/register", {
        name,
        email,
        password,
      });
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      console.log(response.data);
      navigate("/login");
    } catch (submitError) {
      console.error("Registration failed:", submitError);
      setError("Registration failed. Please verify your details and try again.");
    }
  }

  return (
    <main className="app-shell flex items-center justify-center">
      <section className="glass-panel w-full max-w-5xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="hidden border-r border-[var(--border-soft)] bg-gradient-to-br from-cyan-500/20 via-blue-500/5 to-transparent p-8 md:block">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              TicketOps
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Launch your event workflow in minutes.
            </h1>
            <p className="page-subtitle">
              Create your account and access a modern control panel for events
              and ticket operations.
            </p>
          </div>

          <form onSubmit={HandleSubmit} className="p-6 md:p-10">
            <h2 className="page-title text-2xl">Create account</h2>
            <p className="page-subtitle">Start managing tickets with confidence.</p>

            <div className="mt-8 space-y-4">
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
              <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-6 w-full">
              Create account
            </button>

            <p className="mt-5 text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-300">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
