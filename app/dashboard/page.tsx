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
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Entry = {
  id: string;
  title: string;
  amount: number;
  entry_date: string;
  category?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [incomeEntries, setIncomeEntries] = useState<Entry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<Entry[]>([]);

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
          .order("entry_date", { ascending: false }),
        supabase
          .from("expense_entries")
          .select("id,title,amount,entry_date,category")
          .eq("user_id", currentUserId)
          .order("entry_date", { ascending: false }),
      ]);

      if (!mounted) return;

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

  const balance = totalIncome - totalExpenses;
  const savings = Math.max(balance, 0);

  const latestMonthLabel = useMemo(() => {
    const allDates = [...incomeEntries, ...expenseEntries]
      .map((item) => item.entry_date)
      .filter(Boolean);

    if (allDates.length === 0) {
      return new Date().toLocaleString("en-GB", { month: "long", year: "numeric" });
    }

    const latest = new Date(
      allDates.sort((a, b) => +new Date(b) - +new Date(a))[0]
    );

    return latest.toLocaleString("en-GB", { month: "long", year: "numeric" });
  }, [incomeEntries, expenseEntries]);

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
            <span className="hero-badge">Your private finance overview</span>
            <h2>Welcome back, {firstName}.</h2>
            <p>
              Track your monthly balance at a glance and keep your personal
              finances in one clean, premium dashboard.
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
              <span className="mini-label">{latestMonthLabel}</span>
              <span className="mini-pill">Overview only</span>
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
                <strong>£{savings.toFixed(2)}</strong>
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
                  <h3>Overview</h3>
                  <p>Your current finance snapshot</p>
                </div>
              </div>
            </div>

            <div className="dashboard-metric-list">
              <div className="dashboard-metric-row">
                <span>Total income</span>
                <strong>£{totalIncome.toFixed(2)}</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Total expenses</span>
                <strong>£{totalExpenses.toFixed(2)}</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Net balance</span>
                <strong>£{balance.toFixed(2)}</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Total saved</span>
                <strong>£{savings.toFixed(2)}</strong>
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
                  <Receipt size={18} />
                </div>
                <div>
                  <h3>Entries by month</h3>
                  <p>Use the dedicated page to add and review movements</p>
                </div>
              </div>
            </div>

            <div className="dashboard-empty-state">
              Add new income and expenses in the separate entries page, where you
              can also filter everything by month.
            </div>

            <div style={{ marginTop: 16 }}>
              <Link href="/entries" className="primary-button">
                Open entries page
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>
        </section>
      </section>
    </main>
  );
}
