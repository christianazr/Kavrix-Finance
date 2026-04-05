"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  LogOut,
  PiggyBank,
  Receipt,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setEmail(session.user.email ?? "");
      setFullName((session.user.user_metadata as Profile | undefined)?.full_name ?? "");
      setLoading(false);
    };

    loadUser();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
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
          <div className="dashboard-hero-copy">
            <span className="hero-badge">Your private finance overview</span>
            <h2>Welcome back, {firstName}.</h2>
            <p>
              Track your monthly flow, keep recurring costs under control and
              stay on top of your financial balance with a refined dashboard.
            </p>

            <div className="dashboard-user-card">
              <div>
                <p className="dashboard-user-label">Signed in as</p>
                <strong>{email}</strong>
              </div>
              <div className="dashboard-user-chip">Secure session</div>
            </div>
          </div>

          <div className="dashboard-balance-card">
            <div className="dashboard-balance-top">
              <span className="mini-label">April 2026 overview</span>
              <span className="mini-pill">Premium dashboard</span>
            </div>

            <p className="dashboard-balance-label">Available balance</p>
            <h3>£3,420</h3>

            <div className="dashboard-balance-grid">
              <div className="small-card">
                <p>Income</p>
                <strong>£4,860</strong>
              </div>
              <div className="small-card">
                <p>Expenses</p>
                <strong>£1,440</strong>
              </div>
              <div className="small-card">
                <p>Savings</p>
                <strong>£950</strong>
              </div>
              <div className="small-card">
                <p>Left to assign</p>
                <strong>£1,470</strong>
              </div>
            </div>

            <div className="progress-panel">
              <div className="progress-row">
                <span>Monthly budget health</span>
                <span>82%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3>Overview</h3>
                  <p>Your core monthly financial snapshot</p>
                </div>
              </div>
              <span className="dashboard-link-chip">
                Details
                <ArrowUpRight size={14} />
              </span>
            </div>

            <div className="dashboard-metric-list">
              <div className="dashboard-metric-row">
                <span>Monthly income</span>
                <strong>£4,860</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Fixed costs</span>
                <strong>£1,920</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Variable spending</span>
                <strong>£1,140</strong>
              </div>
              <div className="dashboard-metric-row">
                <span>Savings allocated</span>
                <strong>£950</strong>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3>Recent activity</h3>
                  <p>Latest transactions and outgoing costs</p>
                </div>
              </div>
            </div>

            <div className="dashboard-activity-list">
              <div className="dashboard-activity-item">
                <div>
                  <strong>Rent</strong>
                  <p>Monthly housing cost</p>
                </div>
                <span>-£1,250</span>
              </div>

              <div className="dashboard-activity-item">
                <div>
                  <strong>Groceries</strong>
                  <p>Weekly household spend</p>
                </div>
                <span>-£96</span>
              </div>

              <div className="dashboard-activity-item">
                <div>
                  <strong>Salary</strong>
                  <p>Main monthly income</p>
                </div>
                <span className="income">+£3,980</span>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <Target size={18} />
                </div>
                <div>
                  <h3>Goals</h3>
                  <p>What you are currently building toward</p>
                </div>
              </div>
            </div>

            <div className="dashboard-goals">
              <div className="dashboard-goal-card">
                <div className="dashboard-goal-top">
                  <span>Emergency fund</span>
                  <strong>68%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill dashboard-fill-68" />
                </div>
              </div>

              <div className="dashboard-goal-card">
                <div className="dashboard-goal-top">
                  <span>Travel fund</span>
                  <strong>41%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill dashboard-fill-41" />
                </div>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <div className="dashboard-panel-title">
                <div className="feature-icon">
                  <PiggyBank size={18} />
                </div>
                <div>
                  <h3>Quick actions</h3>
                  <p>Shortcuts for your next steps</p>
                </div>
              </div>
            </div>

            <div className="dashboard-actions-grid">
              <button className="dashboard-action-card">
                <CreditCard size={18} />
                <span>Add expense</span>
              </button>

              <button className="dashboard-action-card">
                <Wallet size={18} />
                <span>Add income</span>
              </button>

              <button className="dashboard-action-card">
                <Target size={18} />
                <span>Create goal</span>
              </button>

              <button className="dashboard-action-card">
                <Receipt size={18} />
                <span>View budget</span>
              </button>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
