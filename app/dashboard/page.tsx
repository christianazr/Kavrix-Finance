"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  LogOut,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#06070a] text-white">
        <p className="text-white/60">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(92,119,255,0.16),transparent_35%)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-white/50">Private workspace</p>
              <h1 className="text-xl font-semibold">Kavrix Finance</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-white/50">April 2026</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">
              Monthly Overview
            </h2>
            <p className="mt-3 text-white/60">
              A clear view of your income, spending and balance this month.
            </p>
          </div>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            + Positive month
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/55">Income</p>
              <TrendingUp className="h-5 w-5 text-white/60" />
            </div>
            <p className="mt-5 text-3xl font-semibold">£3,250</p>
            <p className="mt-2 text-sm text-white/45">Monthly incoming funds</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/55">Fixed expenses</p>
              <CreditCard className="h-5 w-5 text-white/60" />
            </div>
            <p className="mt-5 text-3xl font-semibold">£1,540</p>
            <p className="mt-2 text-sm text-white/45">Rent, bills and subscriptions</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/55">Variable expenses</p>
              <Wallet className="h-5 w-5 text-white/60" />
            </div>
            <p className="mt-5 text-3xl font-semibold">£620</p>
            <p className="mt-2 text-sm text-white/45">Flexible day-to-day spending</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/55">Net balance</p>
              <PiggyBank className="h-5 w-5 text-white/60" />
            </div>
            <p className="mt-5 text-3xl font-semibold text-emerald-300">£1,090</p>
            <p className="mt-2 text-sm text-white/45">Amount left after expenses</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Spending Snapshot</h3>
                <p className="mt-1 text-sm text-white/50">
                  Quick monthly allocation overview
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-white/50" />
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-white/60">
                  <span>Fixed expenses</span>
                  <span>47%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[47%] rounded-full bg-white" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-white/60">
                  <span>Variable expenses</span>
                  <span>19%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[19%] rounded-full bg-white/80" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-white/60">
                  <span>Remaining balance</span>
                  <span>34%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[34%] rounded-full bg-emerald-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <h3 className="text-xl font-semibold">Next steps</h3>
            <p className="mt-2 text-sm text-white/50">
              Useful actions to keep building the app
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                Add editable transactions page
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                Add categories and monthly filters
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                Add charts and recurring bills
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
