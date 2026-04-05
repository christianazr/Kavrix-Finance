"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(92,119,255,0.16),transparent_35%)] pointer-events-none" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-white/50">Welcome back</p>
              <h1 className="text-xl font-semibold">Kavrix Finance</h1>
            </div>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">Log in</h2>
            <p className="mt-2 text-sm text-white/60">
              Access your premium budgeting dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-white/50" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-white/50" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Log in"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/55">
            Don’t have an account?{" "}
            <Link href="/register" className="font-medium text-white">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
