import { ApprovalInbox } from "@/components/approval-inbox";
import { MissionShell } from "@/components/mission-shell";
import { PageHeader, Panel, TonePill } from "@/components/ui";
import { getMissionData } from "@/lib/mission-data";

export const dynamic = "force-dynamic";

export default function ApprovalsPage() {
  const data = getMissionData();

  return (
    <MissionShell>
      <PageHeader
        title="Approvals"
        subtitle="Decision queue for anything Hermes should not do without Luke explicitly approving it."
        aside={<TonePill tone="green">Local log active</TonePill>}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Needs Luke</h2>
            <span className="text-xs text-zinc-500">Prototype actions only</span>
          </div>

          <ApprovalInbox initialPending={data.approvals} initialHistory={data.approvalHistory} />
        </Panel>

        <Panel className="p-5">
          <h2 className="text-lg font-semibold">Approval rules</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
            <p>Mission Control should ask first before risky actions: sending messages, editing important files, scanning broad folders, changing auth, or posting publicly.</p>
            <p>Low-risk local reads can be automated later, but anything security-sensitive stays explicit.</p>
          </div>
          <div className="mt-5 rounded-xl border border-blue-400/15 bg-blue-400/[0.06] p-4 text-sm text-blue-100">
            Decisions now write to `data/approvals.json` locally. This is the first real approval gate.
          </div>
        </Panel>
      </div>
    </MissionShell>
  );
}
