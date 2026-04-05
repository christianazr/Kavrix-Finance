"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Lock, Mail, Wallet } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="auth-page">
      <div className="auth-bg" />

      <header className="auth-header">
        <Link href="/" className="brand auth-brand">
          <div className="brand-icon">
            <Wallet size={18} />
          </div>
          <div>
            <p className="brand-kicker">Welcome back</p>
            <h1>Kavrix Finance</h1>
          </div>
        </Link>
      </header>

      <section className="auth-shell">
        <div className="auth-copy">
          <span className="hero-badge">Private access to your premium dashboard</span>
          <h2>Log in</h2>
          <p>
            Access your premium budgeting dashboard and continue tracking your
            monthly finances with clarity.
          </p>

          <div className="auth-copy-card">
            <h3>Elegant finance, simplified</h3>
            <p>
              Keep your income, recurring costs and monthly spending in one
              refined space designed to feel fast and effortless.
            </p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-top">
            <span className="mini-label">Secure sign in</span>
            <span className="mini-pill">Premium access</span>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label>Email address</label>
              <div className="input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="primary-button auth-submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account?{" "}
            <Link href="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
