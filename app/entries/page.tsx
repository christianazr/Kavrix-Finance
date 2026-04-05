"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Wallet,
  Receipt,
  PiggyBank,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type IncomeEntry = {
  id: string;
  title: string;
  amount: number;
  entry_date: string;
};

type ExpenseEntry = {
  id: string;
  title: string;
  amount: number;
  entry_date: string;
  category?: string | null;
};

const expenseCategories = [
  "Housing",
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Travel",
  "Subscriptions",
  "Other",
];

function getMonthInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthRange(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function getYearRange(monthValue: string) {
  const [year] = monthValue.split("-").map(Number);
  const start = `${year}-01-01`;
  const end = `${year + 1}-01-01`;
  return { start, end };
}

export default function EntriesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getMonthInputValue(new Date()));

  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [yearIncomeEntries, setYearIncomeEntries] = useState<IncomeEntry[]>([]);
  const [yearExpenseEntries, setYearExpenseEntries] = useState<ExpenseEntry[]>([]);

  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().slice(0, 10));

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Other");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));

  const [savingIncome, setSavingIncome] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);

  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setUserId(session.user.id);
      setLoading(false);
    };

    loadSession();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      const monthRange = getMonthRange(selectedMonth);
      const yearRange = getYearRange(selectedMonth);

      const [
        incomeMonthRes,
        expenseMonthRes,
        incomeYearRes,
        expenseYearRes,
      ] = await Promise.all([
        supabase
          .from("income_entries")
          .select("id,title,amount,entry_date")
          .eq("user_id", userId)
          .gte("entry_date", monthRange.start)
          .lt("entry_date", monthRange.end)
          .order("entry_date", { ascending: false }),
        supabase
          .from("expense_entries")
          .select("id,title,amount,entry_date,category")
          .eq("user_id", userId)
          .gte("entry_date", monthRange.start)
          .lt("entry_date", monthRange.end)
          .order("entry_date", { ascending: false }),
        supabase
          .from("income_entries")
          .select("id,title,amount,entry_date")
          .eq("user_id", userId)
          .gte("entry_date", yearRange.start)
          .lt("entry_date", yearRange.end),
        supabase
          .from("expense_entries")
          .select("id,title,amount,entry_date,category")
          .eq("user_id", userId)
          .gte("entry_date", yearRange.start)
          .lt("entry_date", yearRange.end),
      ]);

      setIncomeEntries((incomeMonthRes.data as IncomeEntry[]) ?? []);
      setExpenseEntries((expenseMonthRes.data as ExpenseEntry[]) ?? []);
      setYearIncomeEntries((incomeYearRes.data as IncomeEntry[]) ?? []);
      setYearExpenseEntries((expenseYearRes.data as ExpenseEntry[]) ?? []);
    };

    loadData();
  }, [userId, selectedMonth]);

  const monthIncome = useMemo(
    () => incomeEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [incomeEntries]
  );

  const monthExpenses = useMemo(
    () => expenseEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [expenseEntries]
  );

  const yearIncome = useMemo(
    () => yearIncomeEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [yearIncomeEntries]
  );

  const yearExpenses = useMemo(
    () => yearExpenseEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [yearExpenseEntries]
  );

  const monthBalance = monthIncome - monthExpenses;
  const yearBalance = yearIncome - yearExpenses;

  const resetIncomeForm = () => {
    setIncomeTitle("");
    setIncomeAmount("");
    setIncomeDate(new Date().toISOString().slice(0, 10));
    setEditingIncomeId(null);
  };

  const resetExpenseForm = () => {
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseCategory("Other");
    setExpenseDate(new Date().toISOString().slice(0, 10));
    setEditingExpenseId(null);
  };

  const handleAddOrUpdateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !incomeTitle.trim() || !incomeAmount) return;

    setSavingIncome(true);

    if (editingIncomeId) {
      const { data, error } = await supabase
        .from("income_entries")
        .update({
          title: incomeTitle.trim(),
          amount: Number(incomeAmount),
          entry_date: incomeDate,
        })
        .eq("id", editingIncomeId)
        .eq("user_id", userId)
        .select("id,title,amount,entry_date")
        .single();

      setSavingIncome(false);
      if (error || !data) return;

      const updated = data as IncomeEntry;
      const updatedMonth = updated.entry_date.slice(0, 7);

      if (updatedMonth === selectedMonth) {
        setIncomeEntries((prev) =>
          prev
            .map((item) => (item.id === editingIncomeId ? updated : item))
            .sort((a, b) => +new Date(b.entry_date) - +new Date(a.entry_date))
        );
      } else {
        setIncomeEntries((prev) => prev.filter((item) => item.id !== editingIncomeId));
      }

      resetIncomeForm();
      return;
    }

    const { data, error } = await supabase
      .from("income_entries")
      .insert({
        user_id: userId,
        title: incomeTitle.trim(),
        amount: Number(incomeAmount),
        entry_date: incomeDate,
      })
      .select("id,title,amount,entry_date")
      .single();

    setSavingIncome(false);
    if (error || !data) return;

    if (incomeDate.slice(0, 7) === selectedMonth) {
      setIncomeEntries((prev) =>
        [data as IncomeEntry, ...prev].sort(
          (a, b) => +new Date(b.entry_date) - +new Date(a.entry_date)
        )
      );
    }

    resetIncomeForm();
  };

  const handleAddOrUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !expenseTitle.trim() || !expenseAmount) return;

    setSavingExpense(true);

    if (editingExpenseId) {
      const { data, error } = await supabase
        .from("expense_entries")
        .update({
          title: expenseTitle.trim(),
          amount: Number(expenseAmount),
          category: expenseCategory,
          entry_date: expenseDate,
        })
        .eq("id", editingExpenseId)
        .eq("user_id", userId)
        .select("id,title,amount,entry_date,category")
        .single();

      setSavingExpense(false);
      if (error || !data) return;

      const updated = data as ExpenseEntry;
      const updatedMonth = updated.entry_date.slice(0, 7);

      if (updatedMonth === selectedMonth) {
        setExpenseEntries((prev) =>
          prev
            .map((item) => (item.id === editingExpenseId ? updated : item))
            .sort((a, b) => +new Date(b.entry_date) - +new Date(a.entry_date))
        );
      } else {
        setExpenseEntries((prev) => prev.filter((item) => item.id !== editingExpenseId));
      }

      resetExpenseForm();
      return;
    }

    const { data, error } = await supabase
      .from("expense_entries")
      .insert({
        user_id: userId,
        title: expenseTitle.trim(),
        amount: Number(expenseAmount),
        category: expenseCategory,
        entry_date: expenseDate,
      })
      .select("id,title,amount,entry_date,category")
      .single();

    setSavingExpense(false);
    if (error || !data) return;

    if (expenseDate.slice(0, 7) === selectedMonth) {
      setExpenseEntries((prev) =>
        [data as ExpenseEntry, ...prev].sort(
          (a, b) => +new Date(b.entry_date) - +new Date(a.entry_date)
        )
      );
    }

    resetExpenseForm();
  };

  const handleDeleteIncome = async (id: string) => {
    const previous = incomeEntries;
    setIncomeEntries((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("income_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) setIncomeEntries(previous);
  };

  const handleDeleteExpense = async (id: string) => {
    const previous = expenseEntries;
    setExpenseEntries((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("expense_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) setExpenseEntries(previous);
  };

  const startEditIncome = (item: IncomeEntry) => {
    setEditingIncomeId(item.id);
    setIncomeTitle(item.title);
    setIncomeAmount(String(item.amount));
    setIncomeDate(item.entry_date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditExpense = (item: ExpenseEntry) => {
    setEditingExpenseId(item.id);
    setExpenseTitle(item.title);
    setExpenseAmount(String(item.amount));
    setExpenseCategory(item.category || "Other");
    setExpenseDate(item.entry_date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-bg" />
        <section className="dashboard-shell">
          <div className="dashboard-loading-card">
            <p>Loading entries...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-bg" />

      <header className="dashboard-header">
        <div className="brand">
          <div className="brand-icon">
            <Wallet size={18} />
          </div>
          <div>
            <p className="brand-kicker">Finance entries</p>
            <h1>Kavrix Finance</h1>
          </div>
        </div>

        <div className="dashboard-header-actions">
          <Link href="/dashboard" className="secondary-button">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>
      </header>

      <section className="dashboard-shell">
        <motion.section
          className="dashboard-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="dashboard-panel-head">
            <div className="dashboard-panel-title">
              <div className="feature-icon">
                <Receipt size={18} />
              </div>
              <div>
                <h3>Monthly filter</h3>
                <p>Review everything month by month</p>
              </div>
            </div>
          </div>

          <div className="entries-filter-row">
            <div className="input-group entries-month-picker">
              <label>Select month</label>
              <div className="input-wrap">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-balance-grid">
            <div className="small-card">
              <p>Income this month</p>
              <strong>£{monthIncome.toFixed(2)}</strong>
            </div>
            <div className="small-card">
              <p>Expenses this month</p>
              <strong>£{monthExpenses.toFixed(2)}</strong>
            </div>
            <div className="small-card">
              <p>Balance this month</p>
              <strong>£{monthBalance.toFixed(2)}</strong>
            </div>
            <div className="small-card">
              <p>Entries this month</p>
              <strong>{incomeEntries.length + expenseEntries.length}</strong>
            </div>
          </div>

          <div className="dashboard-balance-grid entries-year-summary">
            <div className="small-card">
              <p>Income this year</p>
              <strong>£{yearIncome.toFixed(2)}</strong>
            </div>
            <div className="small-card">
              <p>Expenses this year</p>
              <strong>£{yearExpenses.toFixed(2)}</strong>
            </div>
            <div className="small-card">
              <p>Balance this year</p>
              <strong>£{yearBalance.toFixed(2)}</strong>
            </div>
            <div className="small-card">
              <p>Year selected</p>
              <strong>{selectedMonth.slice(0, 4)}</strong>
            </div>
          </div>
        </motion.section>

        <section className="dashboard-grid entries-top-grid">
          <motion.article
            className="dashboard-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3>{editingIncomeId ? "Edit income" : "Add income"}</h3>
                  <p>Create or update income entries</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddOrUpdateIncome} className="dashboard-form">
              <div className="input-group">
                <label>Title</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Salary, freelance, bonus..."
                    value={incomeTitle}
                    onChange={(e) => setIncomeTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Amount</label>
                <div className="input-wrap">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Date</label>
                <div className="input-wrap">
                  <input
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="entries-form-actions">
                <button className="primary-button dashboard-submit" disabled={savingIncome}>
                  {savingIncome ? "Saving..." : editingIncomeId ? "Update income" : "Add income"}
                </button>
                {editingIncomeId ? (
                  <button
                    type="button"
                    className="secondary-button entries-cancel-button"
                    onClick={resetIncomeForm}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </motion.article>

          <motion.article
            className="dashboard-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <PiggyBank size={18} />
                </div>
                <div>
                  <h3>{editingExpenseId ? "Edit expense" : "Add expense"}</h3>
                  <p>Track expenses with categories</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddOrUpdateExpense} className="dashboard-form">
              <div className="input-group">
                <label>Title</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Rent, groceries, transport..."
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Category</label>
                <div className="input-wrap">
                  <select
                    className="entries-select"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                  >
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Amount</label>
                <div className="input-wrap">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Date</label>
                <div className="input-wrap">
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="entries-form-actions">
                <button className="primary-button dashboard-submit" disabled={savingExpense}>
                  {savingExpense ? "Saving..." : editingExpenseId ? "Update expense" : "Add expense"}
                </button>
                {editingExpenseId ? (
                  <button
                    type="button"
                    className="secondary-button entries-cancel-button"
                    onClick={resetExpenseForm}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </motion.article>
        </section>

        <section className="dashboard-grid">
          <motion.article
            className="dashboard-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <Wallet size={18} />
                </div>
                <div>
                  <h3>Income this month</h3>
                  <p>Entries for {selectedMonth}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-activity-list">
              {incomeEntries.length === 0 ? (
                <div className="dashboard-empty-state">No income entries for this month.</div>
              ) : (
                incomeEntries.map((item) => (
                  <div key={item.id} className="dashboard-activity-item entries-item-card">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.entry_date}</p>
                    </div>
                    <div className="entries-item-right">
                      <span className="income">+£{Number(item.amount).toFixed(2)}</span>
                      <div className="entries-item-actions">
                        <button
                          type="button"
                          className="entries-icon-button"
                          onClick={() => startEditIncome(item)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="entries-icon-button danger"
                          onClick={() => handleDeleteIncome(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.article>

          <motion.article
            className="dashboard-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3>Expenses this month</h3>
                  <p>Entries for {selectedMonth}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-activity-list">
              {expenseEntries.length === 0 ? (
                <div className="dashboard-empty-state">No expense entries for this month.</div>
              ) : (
                expenseEntries.map((item) => (
                  <div key={item.id} className="dashboard-activity-item entries-item-card">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.category || "General"} · {item.entry_date}</p>
                    </div>
                    <div className="entries-item-right">
                      <span>-£{Number(item.amount).toFixed(2)}</span>
                      <div className="entries-item-actions">
                        <button
                          type="button"
                          className="entries-icon-button"
                          onClick={() => startEditExpense(item)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="entries-icon-button danger"
                          onClick={() => handleDeleteExpense(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.article>
        </section>
      </section>
    </main>
  );
}
