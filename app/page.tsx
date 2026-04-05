import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-between">
        <header className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-wide">Kavrix Finance</div>
          <div className="flex gap-3">
            <Link href="/login" className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/85">
              Log in
            </Link>
            <Link href="/register" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black">
              Create account
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-10 py-16 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/65">
              Premium personal finance
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
              Build better monthly budgets with total clarity.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
              Organise your income, fixed costs and variable spending in one elegant space. See each month clearly and stay on top of your financial balance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-2xl bg-white px-6 py-3 font-medium text-black">
                Start now
              </Link>
              <Link href="/login" className="rounded-2xl border border-white/15 px-6 py-3 text-white/85">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="glass rounded-[32px] p-6 shadow-2xl shadow-black/30">
            <div className="rounded-[28px] border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/55">April 2026</p>
                  <h2 className="mt-1 text-2xl font-semibold">Monthly Overview</h2>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">+ Positive</span>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/55">Income</p>
                  <p className="mt-2 text-2xl font-semibold">£3,250</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/55">Fixed expenses</p>
                    <p className="mt-2 text-xl font-semibold">£1,540</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/55">Variable expenses</p>
                    <p className="mt-2 text-xl font-semibold">£620</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/55">Net balance</p>
                  <p className="mt-2 text-3xl font-semibold">£1,090</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
