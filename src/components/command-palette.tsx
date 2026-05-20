"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { filterCommandItems, type CommandItem } from "@/lib/command-items";

export function CommandPalette({ items }: { items: CommandItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => filterCommandItems(items, query), [items, query]);

  function openPalette() {
    setQuery("");
    setOpen(true);
  }

  function closePalette() {
    setQuery("");
    setOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        openPalette();
      }

      if (event.key === "Escape") {
        closePalette();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="hidden h-10 w-72 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 text-left text-sm text-zinc-500 transition hover:border-blue-400/25 hover:bg-white/[0.07] hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40 md:flex"
        aria-label="Open command palette"
      >
        <span>⌕</span>
        <span>Search</span>
        <kbd className="ml-auto rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-zinc-400">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-sm md:pt-28" role="dialog" aria-modal="true" aria-label="Command palette">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={closePalette}
            aria-label="Close command palette"
          />

          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0b0b10]/95 shadow-2xl shadow-black/50 ring-1 ring-white/[0.04]">
            <div className="flex items-center gap-3 border-b border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <span className="text-zinc-500">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, projects, tasks…"
                className="h-10 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              />
              <kbd className="rounded border border-white/[0.08] bg-black/30 px-2 py-1 text-[11px] text-zinc-500">Esc</kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={closePalette}
                      className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-blue-400/25 hover:bg-blue-400/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-zinc-500 group-hover:text-blue-200">
                        {item.section === "Tasks" ? "▦" : item.section === "Projects" ? "▱" : "⌘"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-zinc-100">{item.label}</span>
                        <span className="mt-0.5 block truncate text-xs text-zinc-500">{item.section} · {item.href}</span>
                      </span>
                      <span className="text-zinc-700 group-hover:text-zinc-500">↵</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/[0.08] px-4 py-10 text-center text-sm text-zinc-500">
                  No commands found for “{query}”.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
