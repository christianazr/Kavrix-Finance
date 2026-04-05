import Link from "next/link";
import { ArrowRight, Shield, LineChart, Sparkles, Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-bg" />

      <header className="landing-header">
        <div className="brand">
          <div className="brand-icon">
            <Wallet size={18} />
          </div>
          <div>
            <p className="brand-kicker">Premium personal finance</p>
            <h1>Kavrix Finance</h1>
          </div>
        </div>

        <nav className="landing-nav">
          <Link href="/login" className="nav-link">
            Log in
          </Link>
          <Link href="/register" className="nav-button">
            Create account
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">
            <Sparkles size={16} />
            Elegant budgeting, without the clutter
          </span>

          <h2>Build better monthly budgets with total clarity.</h2>

          <p>
            Organise your income, fixed costs and variable spending in one elegant
            space. See each month clearly and stay on top of your financial balance.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="primary-button">
              Start now
              <ArrowRight size={18} />
            </Link>

            <Link href="/login" className="secondary-button">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-glow" />
          <div className="card-top">
            <span className="mini-label">April 2026</span>
            <span className="mini-pill">Premium feel</span>
          </div>

          <div className="stat-block">
            <p className="stat-label">Monthly income</p>
            <h3>£4,860</h3>
          </div>

          <div className="stat-grid">
            <div className="small-card">
              <p>Fixed costs</p>
              <strong>£1,920</strong>
            </div>
            <div className="small-card">
              <p>Flexible spend</p>
              <strong>£1,140</strong>
            </div>
            <div className="small-card">
              <p>Savings</p>
              <strong>£950</strong>
            </div>
            <div className="small-card">
              <p>Remaining</p>
              <strong>£850</strong>
            </div>
          </div>

          <div className="progress-panel">
            <div className="progress-row">
              <span>Budget health</span>
              <span>82%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <article className="feature-card">
          <div className="feature-icon">
            <Shield size={20} />
          </div>
          <h3>Secure access</h3>
          <p>Private sign-in and clean access to your own dashboard.</p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">
            <LineChart size={20} />
          </div>
          <h3>Monthly control</h3>
          <p>Track income, recurring costs and day-to-day spending.</p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">
            <Sparkles size={20} />
          </div>
          <h3>Premium feel</h3>
          <p>A refined interface designed for clarity and speed.</p>
        </article>
      </section>
    </main>
  );
}
