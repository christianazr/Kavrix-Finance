"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  CreditCard,
  LogOut,
  PiggyBank,
  Plus,
  Receipt,
  Target,
  TrendingUp,
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

type ProfileRow = {
  full_name: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const [incomeEntries, setIncomeEntries] = useState<Entry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<Entry[]>([]);

  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");

  const [savingIncome, setSavingIncome] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const currentUserId = session.user.id;

      const [profileRes, incomeRes, expenseRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", currentUserId).maybeSingle(),
        supabase
          .from("income_entries")
          .select("id,title,amount,entry_date")
          .eq("user_id", currentUserId)
          .order("entry_date", { ascending: true }),
        supabase
          .from("expense_entries")
          .select("id,title,amount,entry_date,category")
          .eq("user_id", currentUserId)
          .order("entry_date", { ascending: true }),
      ]);

      if (!mounted) return;

      setUserId(currentUserId);
      setEmail(session.user.email ?? "");
      setFullName(profileRes.data?.full_name ?? "");
      setIncomeEntries((incomeRes.data as Entry[]) ?? []);
      setExpenseEntries((expenseRes.data as Entry[]) ?? []);
      setLoading(false);
    };

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/login");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const firstName = useMemo(() => {
    if (!fullName) return "there";
    return fullName.split(" ")[0];
  }, [fullName]);

  const totalIncome = useMemo(
    () => incomeEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [incomeEntries]
  );

  const totalExpenses = useMemo(
    () => expenseEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [expenseEntries]
  );

  const totalSavings = Math.max(totalIncome - totalExpenses, 0);
  const balance = totalIncome - totalExpenses;

  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { name: string; income: number; expenses: number }>();

    for (const item of incomeEntries) {
      const date = new Date(item.entry_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const name = date.toLocaleString("en-GB", { month: "short" });

      if (!monthMap.has(key)) {
        monthMap.set(key, { name, income: 0, expenses: 0 });
      }

      monthMap.get(key)!.income += Number(item.amount);
    }

    for (const item of expenseEntries) {
      const date = new Date(item.entry_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const name = date.toLocaleString("en-GB", { month: "short" });

      if (!monthMap.has(key)) {
        monthMap.set(key, { name, income: 0, expenses: 0 });
      }

      monthMap.get(key)!.expenses += Number(item.amount);
    }

    return Array.from(monthMap.values()).slice(-6);
  }, [incomeEntries, expenseEntries]);

  const recentExpenses = useMemo(() => {
    return [...expenseEntries]
      .sort((a, b) => +new Date(b.entry_date) - +new Date(a.entry_date))
      .slice(0, 4);
  }, [expenseEntries]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

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
      })
      .select("id,title,amount,entry_date")
      .single();

    setSavingIncome(false);

    if (error || !data) return;

    setIncomeEntries((prev) => [...prev, data as Entry]);
    setIncomeTitle("");
    setIncomeAmount("");
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
      })
      .select("id,title,amount,entry_date,category")
      .single();

    setSavingExpense(false);

    if (error || !data) return;

    setExpenseEntries((prev) => [...prev, data as Entry]);
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseCategory("");
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-bg" />
        <section className="dashboard-shell">
          <div className="dashboard-loading-card">
            <p>Loading your dashboard...</p>
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
            <p className="brand-kicker">Premium personal finance</p>
            <h1>Kavrix Finance</h1>
          </div>
        </div>

        <div className="dashboard-header-actions">
          <Link href="/" className="secondary-button">
            View site
          </Link>
          <button className="secondary-button dashboard-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-shell">
        <section className="dashboard-hero">
          <motion.div
            className="dashboard-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="hero-badge">Your private finance overview</span>
            <h2>Welcome back, {firstName}.</h2>
            <p>
              Track your real monthly flow, monitor expenses and build savings
              with a cleaner, more premium financial workspace.
            </p>

            <div className="dashboard-user-card">
              <div>
                <p className="dashboard-user-label">Signed in as</p>
                <strong>{email}</strong>
              </div>
              <div className="dashboard-user-chip">Secure session</div>
            </div>
          </motion.div>

          <motion.div
            className="dashboard-balance-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="dashboard-balance-top">
              <span className="mini-label">Live overview</span>
              <span className="mini-pill">Connected to Supabase</span>
            </div>

            <p className="dashboard-balance-label">Available balance</p>
            <h3>£{balance.toFixed(2)}</h3>

            <div className="dashboard-balance-grid">
              <div className="small-card">
                <p>Income</p>
                <strong>£{totalIncome.toFixed(2)}</strong>
              </div>
              <div className="small-card">
                <p>Expenses</p>
                <strong>£{totalExpenses.toFixed(2)}</strong>
              </div>
              <div className="small-card">
                <p>Savings</p>
                <strong>£{totalSavings.toFixed(2)}</strong>
              </div>
              <div className="small-card">
                <p>Entries</p>
                <strong>{incomeEntries.length + expenseEntries.length}</strong>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="dashboard-grid">
          <motion.article
            className="dashboard-panel dashboard-panel-large"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3>Cash flow</h3>
                  <p>Income vs expenses over time</p>
                </div>
              </div>
              <span className="dashboard-link-chip">
                Insights
                <ArrowUpRight size={14} />
              </span>
            </div>

            <div className="chart-card">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stroke="#d5b67a" fillOpacity={0.18} fill="#d5b67a" />
                  <Area type="monotone" dataKey="expenses" stroke="#60a5fa" fillOpacity={0.12} fill="#60a5fa" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.article>

          <motion.article
            className="dashboard-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3>Recent expenses</h3>
                  <p>Your latest outgoing activity</p>
                </div>
              </div>
            </div>

            <div className="dashboard-activity-list">
              {recentExpenses.length === 0 ? (
                <div className="dashboard-empty-state">No expenses yet.</div>
              ) : (
                recentExpenses.map((item) => (
                  <div key={item.id} className="dashboard-activity-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.category || "General"}</p>
                    </div>
                    <span>-£{Number(item.amount).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </motion.article>

          <motion.article
            className="dashboard-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <Plus size={18} />
                </div>
                <div>
                  <h3>Add income</h3>
                  <p>Create real entries in your account</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddIncome} className="dashboard-form">
              <div className="input-group">
                <label>Title</label>
                <div className="input-wrap">
                  <CreditCard size={18} />
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
                  <Wallet size={18} />
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

              <button className="primary-button dashboard-submit" disabled={savingIncome}>
                {savingIncome ? "Saving..." : "Add income"}
              </button>
            </form>
          </motion.article>

          <motion.article
            className="dashboard-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <PiggyBank size={18} />
                </div>
                <div>
                  <h3>Add expense</h3>
                  <p>Track where your money goes</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddExpense} className="dashboard-form">
              <div className="input-group">
                <label>Title</label>
                <div className="input-wrap">
                  <Receipt size={18} />
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
                  <Target size={18} />
                  <input
                    type="text"
                    placeholder="Housing, food, travel..."
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Amount</label>
                <div className="input-wrap">
                  <Wallet size={18} />
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

              <button className="primary-button dashboard-submit" disabled={savingExpense}>
                {savingExpense ? "Saving..." : "Add expense"}
              </button>
            </form>
          </motion.article>
        </section>
      </section>
    </main>
  );
}
