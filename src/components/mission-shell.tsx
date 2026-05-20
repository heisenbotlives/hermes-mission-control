"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CommandPalette } from "@/components/command-palette";
import { buildCommandItems, type CommandItem } from "@/lib/command-items";

const navItems = [
  { label: "Tasks", icon: "▦", href: "/tasks" },
  { label: "Content", icon: "◧", href: "/content", disabled: true },
  { label: "Approvals", icon: "◇", href: "/approvals" },
  { label: "Council", icon: "♕", href: "/council", disabled: true },
  { label: "Calendar", icon: "□", href: "/calendar", disabled: true },
  { label: "Projects", icon: "▱", href: "/projects" },
  { label: "Memory", icon: "♧", href: "/memory", disabled: true },
  { label: "Docs", icon: "▤", href: "/docs", disabled: true },
  { label: "People", icon: "♙", href: "/people", disabled: true },
  { label: "Office", icon: "⌂", href: "/office" },
  { label: "Team", icon: "♢", href: "/team", disabled: true },
];

export function MissionShell({ children, commandItems = buildCommandItems() }: { children: ReactNode; commandItems?: CommandItem[] }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#070708] text-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-white/[0.06] bg-[#09090b] lg:block">
          <Link className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5" href="/office">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm">⌘</div>
            <div>
              <p className="text-sm font-semibold">Mission Control</p>
              <p className="text-[11px] text-zinc-500">Hermes local</p>
            </div>
          </Link>

          <nav className="space-y-1 p-3">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const baseClass = "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition";
              const stateClass = active
                ? "bg-zinc-800 text-white shadow-inner"
                : item.disabled
                  ? "text-zinc-700"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200";

              if (item.disabled) {
                return (
                  <span key={item.label} className={`${baseClass} ${stateClass}`} title="Coming soon">
                    <span className="w-5 text-center text-base text-zinc-600">{item.icon}</span>
                    {item.label}
                    <span className="ml-auto text-[10px] uppercase tracking-wide text-zinc-700">soon</span>
                  </span>
                );
              }

              return (
                <Link key={item.label} className={`${baseClass} ${stateClass}`} href={item.href}>
                  <span className="w-5 text-center text-base text-zinc-400">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="flex h-16 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#09090b]/95 px-4 backdrop-blur md:px-7">
            <Link className="flex items-center gap-3 lg:hidden" href="/office">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">⌘</div>
              <span className="font-semibold">Mission Control</span>
            </Link>
            <CommandPalette items={commandItems} />
            <div className="ml-auto flex items-center gap-5 text-sm text-zinc-400">
              <button className="hidden hover:text-zinc-100 sm:inline">Ⅱ Pause</button>
              <button className="hidden hover:text-zinc-100 sm:inline">Ping Luke</button>
              <span className="text-zinc-600">↻</span>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-7 md:px-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
