"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Lock, Mail, User, Wallet } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const hasSession = !!data.session;

    if (hasSession) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setSuccess("Account created. Check your email to confirm your account, then log in.");
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
            <p className="brand-kicker">Create your account</p>
            <h1>Kavrix Finance</h1>
          </div>
        </Link>
      </header>

      <section className="auth-shell">
        <div className="auth-copy">
          <span className="hero-badge">Open your private budgeting space</span>
          <h2>Get started</h2>
          <p>
            Create your account in seconds and start organising your monthly
            income, savings and spending in one premium dashboard.
          </p>

          <div className="auth-copy-card">
            <h3>Built for clarity</h3>
            <p>
              A clean, modern budgeting experience with secure access and a
              refined visual feel from the very first screen.
            </p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-top">
            <span className="mini-label">New account</span>
            <span className="mini-pill">Fast setup</span>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <label>Full name</label>
              <div className="input-wrap">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}
            {success ? <p className="auth-success">{success}</p> : null}

            <button type="submit" className="primary-button auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
