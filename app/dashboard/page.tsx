"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LogOut,
  Receipt,
  TrendingUp,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/components/mobile-bottom-nav";

type ProfileRow = {
  full_name: string | null;
};

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
  category: string | null;
};

function getCurrentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}`;
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

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedMonth] = useState(getCurrentMonthValue());

  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const userId = session.user.id;
      const monthRange = getMonthRange(selectedMonth);

      const [profileRes, incomeRes, expenseRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
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
      ]);

      if (!mounted) return;

      setEmail(session.user.email ?? "");
      setFullName((profileRes.data as ProfileRow | null)?.full_name ?? "");
      setIncomeEntries((incomeRes.data as IncomeEntry[]) ?? []);
      setExpenseEntries((expenseRes.data as ExpenseEntry[]) ?? []);
      setLoading(false);
    };

    loadDashboard();

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
  }, [router, selectedMonth]);

  const firstName = useMemo(() => {
    if (!fullName) return "there";
    return fullName.split(" ")[0];
  }, [fullName]);

  const monthIncome = useMemo(
    () => incomeEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [incomeEntries]
  );

  const monthExpenses = useMemo(
    () => expenseEntries.reduce((sum, item) => sum + Number(item.amount), 0),
    [expenseEntries]
  );

  const monthBalance = monthIncome - monthExpenses;
  const monthSavings = Math.max(monthBalance, 0);

  const recentActivity = useMemo(() => {
    const income = incomeEntries.map((item) => ({
      id: item.id,
      title: item.title,
      amount: Number(item.amount),
      entry_date: item.entry_date,
      type: "income" as const,
      subtitle: "Income",
    }));

    const expenses = expenseEntries.map((item) => ({
      id: item.id,
      title: item.title,
      amount: Number(item.amount),
      entry_date: item.entry_date,
      type: "expense" as const,
      subtitle: item.category || "Expense",
    }));

    return [...income, ...expenses]
      .sort((a, b) => +new Date(b.entry_date) - +new Date(a.entry_date))
      .slice(0, 5);
  }, [incomeEntries, expenseEntries]);

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }, [selectedMonth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
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
          <Link href="/entries" className="primary-button">
            Manage entries
            <ArrowRight size={16} />
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
            <span className="hero-badge">Your finance overview</span>
            <h2>Welcome back, {firstName}.</h2>
            <p>
              A cleaner monthly snapshot of your income, expenses and available
              balance in one phone-friendly dashboard.
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
              <span className="mini-label">{monthLabel}</span>
              <span className="mini-pill">Overview</span>
            </div>

            <p className="dashboard-balance-label">Available balance</p>
            <h3>£{monthBalance.toFixed(2)}</h3>

            <div className="dashboard-balance-grid">
              <div className="small-card">
                <p>Income</p>
                <strong>£{monthIncome.toFixed(2)}</strong>
              </div>
              <div className="small-card">
                <p>Expenses</p>
                <strong>£{monthExpenses.toFixed(2)}</strong>
              </div>
              <div className="small-card">
                <p>Savings</p>
                <strong>£{monthSavings.toFixed(2)}</strong>
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
            className="dashboard-panel"
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
                  <h3>Monthly overview</h3>
                  <p>Your current month at a glance</p>
                </div>
              </div>
            </div>

            <div className="dashboard-metric-list">
              <div className="dashboard-metric-row">
                <span>Total income</span>
                <strong>£{monthIncome.toFixed(2)}</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Total expenses</span>
                <strong>£{monthExpenses.toFixed(2)}</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Net balance</span>
                <strong>£{monthBalance.toFixed(2)}</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Saved this month</span>
                <strong>£{monthSavings.toFixed(2)}</strong>
              </div>
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
                  <PiggyBank size={18} />
                </div>
                <div>
                  <h3>Quick access</h3>
                  <p>Add and review your movements</p>
                </div>
              </div>
            </div>

            <div className="dashboard-empty-state">
              Open the entries page to add income, add expenses, edit movements
              and review everything by month.
            </div>

            <div style={{ marginTop: 16 }}>
              <Link href="/entries" className="primary-button">
                Open entries
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>

          <motion.article
            className="dashboard-panel dashboard-panel-large"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
          >
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3>Recent activity</h3>
                  <p>Latest movements for this month</p>
                </div>
              </div>
            </div>

            <div className="dashboard-activity-list">
              {recentActivity.length === 0 ? (
                <div className="dashboard-empty-state">No entries yet for this month.</div>
              ) : (
                recentActivity.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="dashboard-activity-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.subtitle} · {item.entry_date}</p>
                    </div>
                    <span className={item.type === "income" ? "income" : undefined}>
                      {item.type === "income" ? "+" : "-"}£{item.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.article>
        </section>
      </section>

      <MobileBottomNav />
    </main>
  );
}
