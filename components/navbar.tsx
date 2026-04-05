"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/budgets", label: "Budgets" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="text-lg font-semibold tracking-wide">
          Kavrix Finance
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active ? "bg-white text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
