"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function EntriesPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setUserId(session.user.id);

      const { data } = await supabase
        .from("income_entries")
        .select("*")
        .eq("user_id", session.user.id);

      setEntries(data || []);
    };

    load();
  }, [router]);

  const total = useMemo(
    () => entries.reduce((s, i) => s + Number(i.amount), 0),
    [entries]
  );

  const addEntry = async (e: any) => {
    e.preventDefault();

    const { data } = await supabase
      .from("income_entries")
      .insert({
        user_id: userId,
        title,
        amount: Number(amount),
      })
      .select()
      .single();

    setEntries((prev) => [data, ...prev]);
    setTitle("");
    setAmount("");
  };

  const remove = async (id: string) => {
    await supabase.from("income_entries").delete().eq("id", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-bg" />

      <header className="dashboard-header">
        <h1>Kavrix Finance</h1>

        <Link href="/dashboard" className="secondary-button">
          <ArrowLeft size={16} /> Back
        </Link>
      </header>

      <section className="dashboard-shell">
        <div className="dashboard-panel">
          <h3>Add entry</h3>

          <form onSubmit={addEntry} className="dashboard-form">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <button className="primary-button">Add</button>
          </form>
        </div>

        <div className="dashboard-panel">
          <h3>Total: £{total.toFixed(2)}</h3>

          <div className="dashboard-activity-list">
            {entries.map((e) => (
              <div key={e.id} className="dashboard-activity-item">
                <div>
                  <strong>{e.title}</strong>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <span>£{e.amount}</span>

                  <button onClick={() => remove(e.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </main>
  );
}
