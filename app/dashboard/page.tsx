"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LogOut, Receipt, TrendingUp, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/components/mobile-bottom-nav";

type Entry = {
  id: string;
  title: string;
  amount: number;
  entry_date: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [incomeEntries, setIncomeEntries] = useState<Entry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const userId = session.user.id;

      const [profile, income, expenses] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", userId).single(),
        supabase.from("income_entries").select("*").eq("user_id", userId),
        supabase.from("expense_entries").select("*").eq("user_id", userId),
      ]);

      setEmail(session.user.email || "");
      setFullName(profile.data?.full_name || "");
      setIncomeEntries(income.data || []);
      setExpenseEntries(expenses.data || []);
      setLoading(false);
    };

    load();
  }, [router]);

  const firstName = useMemo(() => fullName?.split(" ")[0] || "there", [fullName]);

  const income = useMemo(
    () => incomeEntries.reduce((s, i) => s + Number(i.amount), 0),
    [incomeEntries]
  );

  const expenses = useMemo(
    () => expenseEntries.reduce((s, i) => s + Number(i.amount), 0),
    [expenseEntries]
  );

  const balance = income - expenses;

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) return null;

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
            Manage entries <ArrowRight size={16} />
          </Link>

          <button className="secondary-button" onClick={logout}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </header>

      <section className="dashboard-shell">
        <section className="dashboard-hero">
          <motion.div
            className="dashboard-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="hero-badge">Your finance overview</span>
            <h2>Welcome back, {firstName}.</h2>

            <div className="dashboard-user-card">
              <div>
                <p className="dashboard-user-label">Signed in as</p>
                <strong>{email}</strong>
              </div>
              <div className="dashboard-user-chip">Secure</div>
            </div>
          </motion.div>

          <motion.div className="dashboard-balance-card">
            <p className="dashboard-balance-label">Balance</p>
            <h3>£{balance.toFixed(2)}</h3>

            <div className="dashboard-balance-grid">
              <div className="small-card">
                <p>Income</p>
                <strong>£{income.toFixed(2)}</strong>
              </div>
              <div className="small-card">
                <p>Expenses</p>
                <strong>£{expenses.toFixed(2)}</strong>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel">
            <h3>Overview</h3>
            <div className="dashboard-metric-list">
              <div className="dashboard-metric-row">
                <span>Income</span>
                <strong>£{income.toFixed(2)}</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Expenses</span>
                <strong>£{expenses.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <h3>Entries</h3>
            <Link href="/entries" className="primary-button">
              Open entries <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </section>

      <MobileBottomNav />
    </main>
  );
}
