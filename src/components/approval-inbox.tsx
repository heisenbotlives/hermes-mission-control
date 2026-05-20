"use client";

import { useState } from "react";
import { TonePill } from "@/components/ui";
import type { ApprovalDecision, ApprovalHistoryItem } from "@/lib/approval-store";
import type { ApprovalSignal } from "@/lib/mission-data";

const riskTone: Record<ApprovalSignal["risk"], "green" | "amber" | "red"> = {
  low: "green",
  medium: "amber",
  high: "red",
};

const decisionLabels: Record<ApprovalDecision, string> = {
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes requested",
};

const decisionDateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "medium",
  timeZone: "Europe/London",
});

export function ApprovalInbox({
  initialPending,
  initialHistory,
}: {
  initialPending: ApprovalSignal[];
  initialHistory: ApprovalHistoryItem[];
}) {
  const [pending, setPending] = useState(initialPending);
  const [history, setHistory] = useState(initialHistory);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  async function decide(id: string, decision: ApprovalDecision) {
    setError(null);
    setActiveId(id);

    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Approval update failed");
        return;
      }

      setPending(result.pending);
      setHistory(result.history);
    } catch {
      setError("Approval update failed");
    } finally {
      setActiveId(null);
    }
  }

  return (
    <div className="space-y-5">
      {error && <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] p-4 text-sm text-rose-100">{error}</div>}

      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <TonePill tone={pending.length === 0 ? "green" : "amber"}>{pending.length} pending</TonePill>
        <TonePill>{history.length} logged</TonePill>
      </div>

      <div className="space-y-4">
        {pending.map((approval) => (
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
              <button
                className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-emerald-950 disabled:opacity-50"
                disabled={activeId === approval.id}
                onClick={() => decide(approval.id, "approved")}
              >
                Approve
              </button>
              <button
                className="rounded-xl bg-rose-400/90 px-4 py-2 text-sm font-bold text-rose-950 disabled:opacity-50"
                disabled={activeId === approval.id}
                onClick={() => decide(approval.id, "rejected")}
              >
                Reject
              </button>
              <button
                className="rounded-xl border border-white/[0.08] bg-white/[0.06] px-4 py-2 text-sm font-bold text-zinc-200 disabled:opacity-50"
                disabled={activeId === approval.id}
                onClick={() => decide(approval.id, "changes_requested")}
              >
                Ask for changes
              </button>
            </div>
          </article>
        ))}

        {pending.length === 0 && (
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-6 text-sm text-emerald-100">
            No pending approvals. The queue is clear.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Decision history</h3>
          <TonePill>{history.length} logged</TonePill>
        </div>
        <div className="space-y-3">
          {history.map((item) => (
            <div key={`${item.id}-${item.decidedAt}`} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-200">{item.title}</p>
                <TonePill tone={item.decision === "approved" ? "green" : item.decision === "rejected" ? "red" : "amber"}>
                  {decisionLabels[item.decision]}
                </TonePill>
              </div>
              <p className="mt-2 text-xs text-zinc-500">{decisionDateFormatter.format(new Date(item.decidedAt))}</p>
            </div>
          ))}

          {history.length === 0 && <p className="text-sm text-zinc-600">No decisions logged yet.</p>}
        </div>
      </div>
    </div>
  );
}
