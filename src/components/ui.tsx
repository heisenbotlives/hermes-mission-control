import type { ReactNode } from "react";

export function StatusDot({ color }: { color: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color} shadow-[0_0_16px_currentColor]`} />;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-white/[0.08] bg-[#15151a] shadow-2xl shadow-black/30 ${className}`}>{children}</section>;
}

export function PageHeader({
  title,
  subtitle,
  aside,
}: {
  title: string;
  subtitle: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-2 text-base text-zinc-500">{subtitle}</p>
      </div>
      {aside}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${value}%` }} />
    </div>
  );
}

export function TonePill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "blue" | "amber" | "red" | "violet" }) {
  const tones = {
    neutral: "bg-white/[0.06] text-zinc-400 border-white/[0.06]",
    green: "bg-emerald-400/[0.08] text-emerald-200 border-emerald-400/20",
    blue: "bg-blue-400/[0.08] text-blue-200 border-blue-400/20",
    amber: "bg-amber-400/[0.08] text-amber-200 border-amber-400/20",
    red: "bg-rose-400/[0.08] text-rose-200 border-rose-400/20",
    violet: "bg-violet-400/[0.08] text-violet-200 border-violet-400/20",
  };

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
}
