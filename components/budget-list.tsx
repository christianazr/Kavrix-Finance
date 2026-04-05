"use client";
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: budgetsData } = await supabase
      .from("monthly_budgets")
      .select("*")
      .eq("user_id", user.id)
      .order("year", { ascending: false });

    const { data: itemsData } = await supabase
      .from("budget_items")
      .select("*")
      .eq("user_id", user.id);

    const grouped: Record<string, BudgetItem[]> = {};

    (itemsData || []).forEach((item) => {
      if (!grouped[item.budget_id]) grouped[item.budget_id] = [];
      grouped[item.budget_id].push(item as BudgetItem);
    });

    setBudgets((budgetsData || []) as MonthlyBudget[]);
    setItemsMap(grouped);
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) {
    return <div className="text-sm text-white/60">Loading budgets...</div>;
  }

  if (!budgets.length) {
    return <div className="glass rounded-3xl p-5 text-white/65">No budgets yet. Create your first monthly budget above.</div>;
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const items = itemsMap[budget.id] || [];
        const totals = calculateBudgetTotals(items);

        return (
          <div key={budget.id} className="glass rounded-3xl p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {budget.month} {budget.year}
                </h3>
                <p className="mt-1 text-sm text-white/55">Income, fixed expenses, variable expenses and net balance.</p>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  totals.balance >= 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
                }`}
              >
                {totals.balance >= 0 ? "Positive balance" : "Negative balance"}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/55">Income</p>
                <p className="mt-2 text-lg font-semibold">{formatCurrency(totals.income)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/55">Fixed expenses</p>
                <p className="mt-2 text-lg font-semibold">{formatCurrency(totals.fixed)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/55">Variable expenses</p>
                <p className="mt-2 text-lg font-semibold">{formatCurrency(totals.variable)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/55">Balance</p>
                <p className="mt-2 text-lg font-semibold">{formatCurrency(totals.balance)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
