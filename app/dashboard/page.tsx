"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import SummaryCard from "@/components/summary-card";
import { supabase } from "@/lib/supabase";
import { BudgetItem, calculateBudgetTotals, formatCurrency } from "@/lib/helpers";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [variable, setVariable] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: items, error } = await supabase
        .from("budget_items")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading dashboard items:", error.message);
        setLoading(false);
        return;
      }

      const totals = calculateBudgetTotals((items || []) as BudgetItem[]);
      setIncome(totals.income);
      setFixed(totals.fixed);
      setVariable(totals.variable);
      setBalance(totals.balance);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">Overview</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Your financial dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-white/60">
            Review your total income, expenses and overall balance across all monthly budgets.
          </p>
        </div>

        {loading ? (
          <p className="text-white/60">Loading dashboard...</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Total income" value={formatCurrency(income)} />
              <SummaryCard label="Fixed expenses" value={formatCurrency(fixed)} />
              <SummaryCard label="Variable expenses" value={formatCurrency(variable)} />
              <SummaryCard
                label="Net balance"
                value={formatCurrency(balance)}
                subtitle={
                  balance >= 0
                    ? "You are in positive territory."
                    : "Your spending is above your income."
                }
              />
            </div>

            <div className="glass mt-6 rounded-[32px] p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-white/50">Current status</p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {balance >= 0 ? "Positive balance" : "Negative balance"}
                  </h2>
                </div>

                <div
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    balance >= 0
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {formatCurrency(balance)}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
