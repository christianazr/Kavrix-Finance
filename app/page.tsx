import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Wallet, LineChart } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(92,119,255,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_30%)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Premium personal finance</p>
              <h1 className="text-xl font-semibold tracking-wide">Kavrix Finance</h1>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pt-20">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
            <Sparkles className="h-4 w-4" />
            Elegant budgeting, without the clutter
          </div>

          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Build better monthly budgets with total clarity.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Organise your income, fixed costs and variable spending in one elegant
            space. See each month clearly and stay on top of your financial balance.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Start now
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              I already have an account
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <Shield className="mb-4 h-5 w-5 text-white/80" />
              <h3 className="font-medium">Secure access</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Private sign-in and clean access to your own dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <LineChart className="mb-4 h-5 w-5 text-white/80" />
              <h3 className="font-medium">Monthly control</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Track income, recurring costs and day-to-day spending.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <Sparkles className="mb-4 h-5 w-5 text-white/80" />
              <h3 className="font-medium">Premium feel</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                A refined interface designed for clarity and speed.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-2xl">
          <div className="rounded-[28px] border border-white/10 bg-[#0d1017] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">April 2026</p>
                <h3 className="mt-1 text-2xl font-semibold">Monthly Overview</h3>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                Positive
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-white/50">Income</p>
                <p className="mt-3 text-3xl font-semibold">£3,250</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-white/50">Net balance</p>
                <p className="mt-3 text-3xl font-semibold">£1,090</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-white/50">Fixed expenses</p>
                <p className="mt-3 text-2xl font-semibold">£1,540</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-white/50">Variable expenses</p>
                <p className="mt-3 text-2xl font-semibold">£620</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center justify-between text-sm text-white/60">
                <span>Monthly progress</span>
                <span>72%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
