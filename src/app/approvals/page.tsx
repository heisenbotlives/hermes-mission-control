import { MissionShell } from "@/components/mission-shell";
import { PageHeader, Panel, TonePill } from "@/components/ui";
import { getMissionData, type ApprovalSignal } from "@/lib/mission-data";

export const dynamic = "force-dynamic";

const riskTone: Record<ApprovalSignal["risk"], "green" | "amber" | "red"> = {
  low: "green",
  medium: "amber",
  high: "red",
};

export default function ApprovalsPage() {
  const data = getMissionData();

  return (
    <MissionShell>
      <PageHeader
        title="Approvals"
        subtitle="Decision queue for anything Hermes should not do without Luke explicitly approving it."
        aside={<TonePill tone="amber">{data.approvals.length} waiting</TonePill>}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Needs Luke</h2>
            <span className="text-xs text-zinc-500">Prototype actions only</span>
          </div>

          <div className="space-y-4">
            {data.approvals.map((approval) => (
              <article key={approval.id} className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <TonePill tone={riskTone[approval.risk]}>{approval.risk} risk</TonePill>
                      <TonePill>{approval.status}</TonePill>
                      <TonePill tone="blue">Requested by {approval.requester}</TonePill>
                    </div>
                    <h3 className="text-xl font-semibold">{approval.title}</h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Proposed action</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{approval.action}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Why it matters</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{approval.whyItMatters}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-emerald-950">Approve</button>
                  <button className="rounded-xl bg-rose-400/90 px-4 py-2 text-sm font-bold text-rose-950">Reject</button>
                  <button className="rounded-xl border border-white/[0.08] bg-white/[0.06] px-4 py-2 text-sm font-bold text-zinc-200">Ask for changes</button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <h2 className="text-lg font-semibold">Approval rules</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
            <p>Mission Control should ask first before risky actions: sending messages, editing important files, scanning broad folders, changing auth, or posting publicly.</p>
            <p>Low-risk local reads can be automated later, but anything security-sensitive stays explicit.</p>
          </div>
          <div className="mt-5 rounded-xl border border-blue-400/15 bg-blue-400/[0.06] p-4 text-sm text-blue-100">
            Next useful upgrade: make these buttons write to a local approval log instead of being visual only.
          </div>
        </Panel>
      </div>
    </MissionShell>
  );
}
