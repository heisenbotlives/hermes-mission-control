import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { type ApprovalSignal } from "./mission-data";

export type ApprovalDecision = "approved" | "rejected" | "changes_requested";

export type ApprovalHistoryItem = ApprovalSignal & {
  decision: ApprovalDecision;
  decidedAt: string;
};

export type ApprovalStore = {
  pending: ApprovalSignal[];
  history: ApprovalHistoryItem[];
};

export const approvalStorePath = path.join(process.cwd(), "data", "approvals.json");

const defaultPending: ApprovalSignal[] = [
  {
    id: "connect-kanban",
    title: "Connect real Hermes/Kanban task data",
    requester: "Echo",
    risk: "medium",
    status: "Needs review",
    action: "Read local task/session metadata and show it in Mission Control.",
    whyItMatters: "This turns the dashboard from a demo into a real operator console.",
  },
  {
    id: "local-persistence",
    title: "Add local JSON persistence first",
    requester: "Quill",
    risk: "low",
    status: "Queued",
    action: "Create local data files for approvals, projects, activity, and agent state.",
    whyItMatters: "It gives Mission Control memory without introducing cloud services or auth yet.",
  },
  {
    id: "github-token-review",
    title: "Review GitHub token scope separately",
    requester: "Reviewer",
    risk: "high",
    status: "Needs review",
    action: "Open a manual security checklist for GitHub sessions, apps, and token scopes.",
    whyItMatters: "Your local GitHub auth is powerful; changing it should stay explicit.",
  },
];

export function createDefaultApprovalStore(): ApprovalStore {
  return {
    pending: defaultPending,
    history: [],
  };
}

export function readApprovalStore(storePath = approvalStorePath): ApprovalStore {
  if (!existsSync(storePath)) {
    const initialStore = createDefaultApprovalStore();
    writeApprovalStore(initialStore, storePath);
    return initialStore;
  }

  const raw = readFileSync(storePath, "utf8");
  const parsed = JSON.parse(raw) as Partial<ApprovalStore>;

  return {
    pending: parsed.pending ?? [],
    history: parsed.history ?? [],
  };
}

export function writeApprovalStore(store: ApprovalStore, storePath = approvalStorePath) {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export function applyApprovalDecision(id: string, decision: ApprovalDecision, storePath = approvalStorePath): ApprovalStore {
  const store = readApprovalStore(storePath);
  const approval = store.pending.find((item) => item.id === id);

  if (!approval) {
    throw new Error(`Approval not found: ${id}`);
  }

  const nextStore: ApprovalStore = {
    pending: store.pending.filter((item) => item.id !== id),
    history: [
      {
        ...approval,
        decision,
        decidedAt: new Date().toISOString(),
      },
      ...store.history,
    ],
  };

  writeApprovalStore(nextStore, storePath);
  return nextStore;
}
