import { Panel } from "@/components/ui";

export const agents = [
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

export function OfficeMap() {
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
