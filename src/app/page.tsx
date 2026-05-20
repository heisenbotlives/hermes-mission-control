const projects = [
  {
    name: "AI marketing army",
    status: "Planning",
    owner: "Strategy agents",
    next: "Turn the operating-system idea into a public portfolio roadmap.",
    progress: 38,
  },
  {
    name: "Story app",
    status: "Active build",
    owner: "Frontend / product",
    next: "Ship the next small child-friendly interaction and test on mobile.",
    progress: 64,
  },
  {
    name: "Hermes security",
    status: "Monitoring",
    owner: "Ops / reviewer",
    next: "Review GitHub token scope and VS Code/Cursor extensions manually.",
    progress: 72,
  },
];

const agents = [
  { name: "Researcher", role: "Finds facts and sources", state: "Idle", tone: "bg-slate-500" },
  { name: "Analyst", role: "Turns findings into decisions", state: "Ready", tone: "bg-blue-500" },
  { name: "Writer", role: "Drafts polished outputs", state: "Working", tone: "bg-emerald-500" },
  { name: "Reviewer", role: "Checks quality and risk", state: "Blocked", tone: "bg-amber-500" },
];

const tasks = [
  { title: "Draft Mission Control product spec", lane: "In progress", assignee: "Writer", priority: "High" },
  { title: "Map Hermes Kanban data model", lane: "Ready", assignee: "Analyst", priority: "High" },
  { title: "Design approval inbox flow", lane: "Ready", assignee: "Reviewer", priority: "Medium" },
  { title: "Create portfolio demo narrative", lane: "Backlog", assignee: "Writer", priority: "Medium" },
];

const activity = [
  "Mission Control app scaffolded in Next.js.",
  "Dashboard mock data created for projects, agents, tasks, and approvals.",
  "Security audit found story-app .env ignored and not committed.",
  "Next step: connect this UI to real Hermes task/session data.",
];

const approvals = [
  "Rotate broad GitHub token?",
  "Allow wider iCloud Drive scan?",
  "Review unknown editor extensions manually?",
];

function Pill({ children, tone = "border-white/10 bg-white/10 text-slate-200" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>{children}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur ${className}`}>{children}</section>;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070b16] text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_#070b16_0%,_#101827_100%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/30 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Pill tone="border-emerald-400/30 bg-emerald-400/10 text-emerald-200">Local prototype</Pill>
              <Pill>Hermes Mission Control</Pill>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Your AI team command centre.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              A practical dashboard for projects, agents, approvals, tasks, and activity — with Hermes Kanban as the durable engine underneath later.
            </p>
          </div>

          <div className="grid min-w-64 grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div>
              <p className="text-3xl font-semibold">4</p>
              <p className="text-sm text-slate-400">agents</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">3</p>
              <p className="text-sm text-slate-400">projects</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">3</p>
              <p className="text-sm text-slate-400">approvals</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">72%</p>
              <p className="text-sm text-slate-400">safe setup</p>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
          <Card>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-200/70">Projects</p>
                <h2 className="text-2xl font-semibold">Active missions</h2>
              </div>
              <Pill tone="border-blue-400/30 bg-blue-400/10 text-blue-100">Portfolio-ready direction</Pill>
            </div>

            <div className="grid gap-4">
              {projects.map((project) => (
                <article key={project.name} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">Owner: {project.owner}</p>
                    </div>
                    <Pill>{project.status}</Pill>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">Next: {project.next}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400" style={{ width: `${project.progress}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200/70">Needs Luke</p>
            <h2 className="mt-1 text-2xl font-semibold">Approval inbox</h2>
            <div className="mt-5 space-y-3">
              {approvals.map((approval) => (
                <div key={approval} className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <p className="font-medium text-amber-50">{approval}</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button className="rounded-full bg-emerald-400 px-3 py-1 font-semibold text-emerald-950">Approve</button>
                    <button className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
          <Card>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-200/70">Agents</p>
            <h2 className="mt-1 text-2xl font-semibold">Team status</h2>
            <div className="mt-5 space-y-3">
              {agents.map((agent) => (
                <div key={agent.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className={`h-3 w-3 rounded-full ${agent.tone}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{agent.name}</p>
                    <p className="truncate text-xs text-slate-400">{agent.role}</p>
                  </div>
                  <span className="text-xs text-slate-300">{agent.state}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-200/70">Kanban preview</p>
            <h2 className="mt-1 text-2xl font-semibold">Current task flow</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {tasks.map((task) => (
                <article key={task.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Pill tone="border-purple-400/30 bg-purple-400/10 text-purple-100">{task.lane}</Pill>
                    <span className="text-xs text-slate-400">{task.priority}</span>
                  </div>
                  <h3 className="font-semibold leading-6">{task.title}</h3>
                  <p className="mt-3 text-sm text-slate-400">Assigned to {task.assignee}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300/70">Activity</p>
            <h2 className="mt-1 text-2xl font-semibold">Latest signals</h2>
            <ol className="mt-5 space-y-4">
              {activity.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-slate-300">{index + 1}</span>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </li>
              ))}
            </ol>
          </Card>
        </section>
      </div>
    </main>
  );
}
