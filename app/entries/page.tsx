"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  PiggyBank,
  Receipt,
  Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Entry = {
  id: string;
  title: string;
  amount: number;
  entry_date: string;
  category?: string | null;
};

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

export default function EntriesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getMonthInputValue(new Date()));

  const [incomeEntries, setIncomeEntries] = useState<Entry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<Entry[]>([]);

  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().slice(0, 10));

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));

  const [savingIncome, setSavingIncome] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);

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

    const loadMonthData = async () => {
      const { start, end } = getMonthRange(selectedMonth);

      const [incomeRes, expenseRes] = await Promise.all([
        supabase
          .from("income_entries")
          .select("id,title,amount,entry_date")
          .eq("user_id", userId)
          .gte("entry_date", start)
          .lt("entry_date", end)
          .order("entry_date", { ascending: false }),
        supabase
          .from("expense_entries")
          .select("id,title,amount,entry_date,category")
          .eq("user_id", userId)
          .gte("entry_date", start)
          .lt("entry_date", end)
          .order("entry_date", { ascending: false }),
      ]);

      setIncomeEntries((incomeRes.data as Entry[]) ?? []);
      setExpenseEntries((expenseRes.data as Entry[]) ?? []);
    };

    loadMonthData();
  }, [userId, selectedMonth]);

  const monthIncome = useMemo(
    () => incomeEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [incomeEntries]
  );

  const monthExpenses = useMemo(
    () => expenseEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [expenseEntries]
  );

  const monthBalance = monthIncome - monthExpenses;

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !incomeTitle.trim() || !incomeAmount) return;

    setSavingIncome(true);

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

    const entryMonth = incomeDate.slice(0, 7);
    if (entryMonth === selectedMonth) {
      setIncomeEntries((prev) => [data as Entry, ...prev]);
    }

    setIncomeTitle("");
    setIncomeAmount("");
    setIncomeDate(new Date().toISOString().slice(0, 10));
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !expenseTitle.trim() || !expenseAmount) return;

    setSavingExpense(true);

    const { data, error } = await supabase
      .from("expense_entries")
      .insert({
        user_id: userId,
        title: expenseTitle.trim(),
        amount: Number(expenseAmount),
        category: expenseCategory.trim() || null,
        entry_date: expenseDate,
      })
      .select("id,title,amount,entry_date,category")
      .single();

    setSavingExpense(false);

    if (error || !data) return;

    const entryMonth = expenseDate.slice(0, 7);
    if (entryMonth === selectedMonth) {
      setExpenseEntries((prev) => [data as Entry, ...prev]);
    }

    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseCategory("");
    setExpenseDate(new Date().toISOString().slice(0, 10));
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
                <p>Review and manage your data month by month</p>
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
              <p>Total entries</p>
              <strong>{incomeEntries.length + expenseEntries.length}</strong>
            </div>
          </div>
        </motion.section>

        <section className="dashboard-grid">
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
                  <h3>Add income</h3>
                  <p>Create income entries for any month</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddIncome} className="dashboard-form">
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

              <button className="primary-button dashboard-submit" disabled={savingIncome}>
                {savingIncome ? "Saving..." : "Add income"}
              </button>
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
                  <h3>Add expense</h3>
                  <p>Track expenses and assign categories</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddExpense} className="dashboard-form">
              <div className="input-group">
                <label>Title</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Rent, groceries, travel..."
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Category</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Housing, food, transport..."
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
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

              <button className="primary-button dashboard-submit" disabled={savingExpense}>
                {savingExpense ? "Saving..." : "Add expense"}
              </button>
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
                  <div key={item.id} className="dashboard-activity-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.entry_date}</p>
                    </div>
                    <span className="income">+£{Number(item.amount).toFixed(2)}</span>
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
                  <div key={item.id} className="dashboard-activity-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.category || "General"} · {item.entry_date}</p>
                    </div>
                    <span>-£{Number(item.amount).toFixed(2)}</span>
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
