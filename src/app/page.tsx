import { getMissionData } from "@/lib/mission-data";

const navItems = [
  { label: "Tasks", icon: "▦" },
  { label: "Content", icon: "◧" },
  { label: "Approvals", icon: "◇" },
  { label: "Council", icon: "♕" },
  { label: "Calendar", icon: "□" },
  { label: "Projects", icon: "▱" },
  { label: "Memory", icon: "♧" },
  { label: "Docs", icon: "▤" },
  { label: "People", icon: "♙" },
  { label: "Office", icon: "⌂", active: true },
  { label: "Team", icon: "♢" },
];

const agents = [
  { name: "Alex", role: "Operator", state: "Idle", color: "bg-sky-300", position: "left-[8%] top-[54%]" },
  { name: "Quill", role: "Writer", state: "Working", color: "bg-violet-400", position: "left-[18%] top-[58%]" },
  { name: "Echo", role: "Analyst", state: "Chatting", color: "bg-cyan-400", position: "left-[33%] top-[58%]" },
  { name: "Scout", role: "Research", state: "Working", color: "bg-emerald-400", position: "left-[48%] top-[58%]" },
  { name: "Codex", role: "Builder", state: "Walking", color: "bg-orange-400", position: "left-[64%] top-[58%]" },
  { name: "Henry", role: "Reviewer", state: "Chatting", color: "bg-blue-400", position: "left-[63%] top-[19%]" },
  { name: "Pixel", role: "Design", state: "Working", color: "bg-pink-400", position: "left-[79%] top-[78%]" },
];

const desks = [
  "left-[16%] top-[18%]",
  "left-[31%] top-[18%]",
  "left-[46%] top-[18%]",
  "left-[62%] top-[18%]",
  "left-[23%] top-[45%]",
  "left-[39%] top-[45%]",
  "left-[55%] top-[45%]",
  "left-[71%] top-[45%]",
  "left-[83%] top-[63%]",
];

const statusLegend = [
  ["Working", "bg-emerald-400"],
  ["Chatting", "bg-blue-500"],
  ["Walking", "bg-amber-400"],
  ["Idle", "bg-zinc-500"],
];

function StatusDot({ color }: { color: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color} shadow-[0_0_16px_currentColor]`} />;
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-white/[0.08] bg-[#15151a] shadow-2xl shadow-black/30 ${className}`}>{children}</section>;
}

function ControlButton({ children, tone }: { children: React.ReactNode; tone: "green" | "blue" | "amber" | "cyan" }) {
  const tones = {
    green: "border-emerald-400/20 bg-emerald-400/15 text-emerald-200 shadow-emerald-950/40",
    blue: "border-blue-400/20 bg-blue-400/15 text-blue-200 shadow-blue-950/40",
    amber: "border-amber-400/20 bg-amber-400/15 text-amber-200 shadow-amber-950/40",
    cyan: "border-cyan-400/20 bg-cyan-400/15 text-cyan-200 shadow-cyan-950/40",
  };

  return <button className={`h-11 rounded-xl border px-5 text-sm font-semibold shadow-lg ${tones[tone]}`}>{children}</button>;
}

function Desk({ className }: { className: string }) {
  return (
    <div className={`absolute h-10 w-20 ${className}`}>
      <div className="absolute left-2 right-2 top-2 h-4 rounded-sm bg-zinc-500/60" />
      <div className="absolute left-0 right-0 top-5 h-2 rounded bg-zinc-300/40" />
      <div className="absolute left-3 top-7 h-5 w-2 bg-zinc-500/60" />
      <div className="absolute right-3 top-7 h-5 w-2 bg-zinc-500/60" />
      <div className="absolute left-8 top-0 h-5 w-6 rounded-sm border border-blue-300/30 bg-blue-500/80 shadow-[0_0_14px_rgba(59,130,246,0.45)]" />
    </div>
  );
}

function AgentSprite({ agent }: { agent: (typeof agents)[number] }) {
  return (
    <div className={`absolute ${agent.position} flex -translate-x-1/2 flex-col items-center gap-1`}> 
      <div className="relative h-9 w-10">
        <span className={`absolute left-2 top-2 h-5 w-7 rounded-t-lg rounded-b-sm ${agent.color}`} />
        <span className={`absolute left-4 top-0 h-4 w-4 rounded-sm ${agent.color} brightness-125`} />
        <span className="absolute right-0 top-4 h-2 w-2 rounded-full bg-white/45" />
      </div>
      <span className="rounded bg-black/35 px-1.5 py-0.5 text-[10px] font-semibold text-white/90">{agent.name}</span>
    </div>
  );
}

function OfficeMap() {
  return (
    <Panel className="overflow-hidden p-4 lg:min-h-[500px]">
      <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] p-2">
        <button className="rounded-lg bg-[#2a2930] px-4 py-2 text-sm font-semibold text-zinc-200 shadow-inner">＋ Start Chat</button>
        <div className="hidden flex-1 grid-cols-8 gap-3 px-5 md:grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-9 rounded-sm bg-slate-500/35" />
          ))}
        </div>
      </div>

      <div className="relative h-[410px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#26231f]">
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(45deg,#171511_25%,transparent_25%),linear-gradient(-45deg,#171511_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#171511_75%),linear-gradient(-45deg,transparent_75%,#171511_75%)] [background-position:0_0,0_24px,24px_-24px,-24px_0] [background-size:48px_48px]" />
        {desks.map((desk) => <Desk key={desk} className={desk} />)}

        <div className="absolute left-[48%] top-[67%] h-16 w-28 -translate-x-1/2 rounded-[50%] border border-white/10 bg-zinc-500/45" />
        {["left-[43%] top-[64%]", "left-[53%] top-[64%]", "left-[39%] top-[72%]", "left-[58%] top-[72%]"].map((chair) => (
          <div key={chair} className={`absolute h-8 w-8 rounded-full bg-zinc-500/55 ${chair}`} />
        ))}

        <div className="absolute bottom-6 left-7 h-20 w-8 rounded-t-full bg-emerald-400/80" />
        <div className="absolute bottom-2 left-8 h-8 w-6 bg-orange-500/70" />
        <div className="absolute bottom-6 right-7 h-20 w-8 rounded-t-full bg-emerald-400/80" />
        <div className="absolute bottom-2 right-8 h-8 w-6 bg-orange-500/70" />
        <div className="absolute bottom-6 left-20 h-9 w-10 rounded-sm bg-zinc-800 ring-1 ring-white/10">
          <span className="absolute left-2 top-2 h-2 w-2 bg-cyan-400" />
          <span className="absolute right-2 top-2 h-2 w-2 bg-rose-400" />
        </div>

        <div className="absolute left-[59%] top-[14%] rounded-md bg-black px-3 py-1 text-[11px] font-semibold text-white shadow-xl">Build Council - 5...</div>
        {agents.map((agent) => <AgentSprite key={agent.name} agent={agent} />)}
      </div>
    </Panel>
  );
}

export default function Home() {
  const data = getMissionData();

  return (
    <main className="min-h-screen bg-[#070708] text-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-white/[0.06] bg-[#09090b] lg:block">
          <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm">⌘</div>
            <div>
              <p className="text-sm font-semibold">Mission Control</p>
              <p className="text-[11px] text-zinc-500">Hermes local</p>
            </div>
          </div>

          <nav className="space-y-1 p-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  item.active ? "bg-zinc-800 text-white shadow-inner" : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
                href="#"
              >
                <span className="w-5 text-center text-base text-zinc-400">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="flex h-16 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#09090b]/95 px-4 backdrop-blur md:px-7">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">⌘</div>
              <span className="font-semibold">Mission Control</span>
            </div>
            <div className="hidden h-10 w-72 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 text-sm text-zinc-500 md:flex">
              <span>⌕</span>
              <span>Search</span>
              <kbd className="ml-auto rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-zinc-400">⌘K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-5 text-sm text-zinc-400">
              <button className="hidden hover:text-zinc-100 sm:inline">Ⅱ Pause</button>
              <button className="hidden hover:text-zinc-100 sm:inline">Ping Luke</button>
              <span className="text-zinc-600">↻</span>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-7 md:px-7">
            <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">The Office</h1>
                <p className="mt-2 text-base text-zinc-500">AI team headquarters — live local view</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                {statusLegend.map(([label, color]) => (
                  <span key={label} className="flex items-center gap-2"><StatusDot color={color} /> {label}</span>
                ))}
              </div>
            </div>

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
                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-400">{project.status}</span>
                      </div>
                      <p className="mt-3 text-sm leading-5 text-zinc-400">{project.detail}</p>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${project.progress}%` }} />
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>

              <Panel className="p-5">
                <h2 className="text-lg font-semibold">Needs Luke</h2>
                <div className="mt-4 space-y-3">
                  {data.approvals.map((approval) => (
                    <div key={approval} className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4">
                      <p className="text-sm font-medium text-amber-100">{approval}</p>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-bold text-emerald-950">Approve</button>
                        <button className="rounded-lg bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-zinc-200">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
