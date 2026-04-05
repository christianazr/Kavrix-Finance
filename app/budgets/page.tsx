import Navbar from "@/components/navbar";
import BudgetForm from "@/components/budget-form";
import BudgetList from "@/components/budget-list";

export default function BudgetsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">Budgets</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Monthly budget planner</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            Create monthly budgets, review your numbers and keep a clear view of each period.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <div>
            <BudgetForm />
          </div>
          <div>
            <BudgetList />
          </div>
        </div>
      </section>
    </main>
  );
}
