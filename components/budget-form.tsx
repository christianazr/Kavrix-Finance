"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BudgetForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    await supabase.from("monthly_budgets").insert([
      {
        user_id: user.id,
        month,
        year,
      },
    ]);

    setMonth("");
    setYear(new Date().getFullYear());
    setLoading(false);
    onCreated?.();
  };

  return (
    <form onSubmit={handleCreate} className="glass rounded-3xl p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Create monthly budget</h3>
        <p className="mt-1 text-sm text-white/60">Add a new month and start tracking your finances.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Month (e.g. April)"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/35"
          required
        />
        <input
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          type="number"
          placeholder="Year"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/35"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-2xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create budget"}
      </button>
    </form>
  );
}
