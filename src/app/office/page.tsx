import { MissionShell } from "@/components/mission-shell";
import { OfficeMap, agents } from "@/components/office-map";
import { PageHeader, Panel, ProgressBar, StatusDot, TonePill } from "@/components/ui";
import { getMissionData } from "@/lib/mission-data";

export const dynamic = "force-dynamic";

const statusLegend = [
  ["Working", "bg-emerald-400"],
  ["Chatting", "bg-blue-500"],
  ["Walking", "bg-amber-400"],
  ["Idle", "bg-zinc-500"],
];

function ControlButton({ children, tone }: { children: React.ReactNode; tone: "green" | "blue" | "amber" | "cyan" }) {
  const tones = {
    green: "border-emerald-400/20 bg-emerald-400/15 text-emerald-200 shadow-emerald-950/40",
    blue: "border-blue-400/20 bg-blue-400/15 text-blue-200 shadow-blue-950/40",
    amber: "border-amber-400/20 bg-amber-400/15 text-amber-200 shadow-amber-950/40",
    cyan: "border-cyan-400/20 bg-cyan-400/15 text-cyan-200 shadow-cyan-950/40",
  };

  return <button className={`h-11 rounded-xl border px-5 text-sm font-semibold shadow-lg ${tones[tone]}`}>{children}</button>;
}

export default function OfficePage() {
  const data = getMissionData();

  return (
    <MissionShell>
      <PageHeader
        title="The Office"
        subtitle="AI team headquarters — live local view"
        aside={
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            {statusLegend.map(([label, color]) => (
              <span key={label} className="flex items-center gap-2"><StatusDot color={color} /> {label}</span>
            ))}
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-violet-950/45 via-slate-900 to-cyan-950/40 p-5 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-sm font-semibold text-violet-200"><span className="text-xl">✣</span> Demo Controls</div>
        <div className="flex flex-wrap gap-3">
          <ControlButton tone="green">▱ All Working</ControlButton>
          <ControlButton tone="blue">♙ Gather</ControlButton>
          <ControlButton tone="amber">▱ Run Meeting</ControlButton>
          <ControlButton tone="cyan">☕ Watercooler</ControlButton>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <OfficeMap />

        <Panel className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-zinc-100">〽 Live Activity</p>
              <p className="mt-1 text-xs text-zinc-500">Safe local signals, no secrets read</p>
            </div>
            <span className="text-xs text-zinc-600">Last hour</span>
          </div>
          <div className="space-y-3 p-4">
            {data.activity.map((item) => (
              <article key={`${item.actor}-${item.event}`} className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4">
                <p className="text-sm text-zinc-400"><span className="font-semibold text-blue-300">{item.actor}</span> · {item.event}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-300">{item.detail}</p>
                <p className="mt-2 text-xs text-zinc-600">{item.time}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {agents.slice(0, 4).map((agent) => (
          <Panel key={agent.name} className="p-4">
            <div className="flex items-center gap-3">
              <span className={`h-8 w-8 rounded-lg ${agent.color}`} />
              <div>
                <p className="font-semibold">{agent.name}</p>
                <p className="text-xs text-zinc-500">{agent.role} · {agent.state}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Projects</h2>
            <span className="text-xs text-zinc-500">Updated {data.system.updatedAt}</span>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {data.projects.map((project) => (
              <article key={project.name} className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{project.name}</h3>
                  <TonePill>{project.status}</TonePill>
                </div>
                <p className="mt-3 text-sm leading-5 text-zinc-400">{project.detail}</p>
                <div className="mt-4"><ProgressBar value={project.progress} /></div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <h2 className="text-lg font-semibold">Needs Luke</h2>
          <div className="mt-4 space-y-3">
            {data.approvals.map((approval) => (
              <div key={approval.id} className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4">
                <p className="text-sm font-medium text-amber-100">{approval.title}</p>
                <p className="mt-2 text-xs text-zinc-500">{approval.action}</p>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-bold text-emerald-950">Approve</button>
                  <button className="rounded-lg bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-zinc-200">Review</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </MissionShell>
  );
}
