import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  applyApprovalDecision,
  readApprovalStore,
  writeApprovalStore,
  type ApprovalDecision,
} from "../src/lib/approval-store";

const makeTempStore = () => path.join(mkdtempSync(path.join(tmpdir(), "mission-approvals-")), "approvals.json");

test("applyApprovalDecision records a decision and moves the item into history", () => {
  const storePath = makeTempStore();

  writeApprovalStore(
    {
      pending: [
        {
          id: "connect-kanban",
          title: "Connect real Hermes/Kanban task data",
          requester: "Echo",
          risk: "medium",
          status: "Needs review",
          action: "Read local task/session metadata and show it in Mission Control.",
          whyItMatters: "This turns the dashboard from a demo into a real operator console.",
        },
      ],
      history: [],
    },
    storePath,
  );

  const decision: ApprovalDecision = "approved";
  const result = applyApprovalDecision("connect-kanban", decision, storePath);

  assert.equal(result.pending.length, 0);
  assert.equal(result.history.length, 1);
  assert.equal(result.history[0].id, "connect-kanban");
  assert.equal(result.history[0].decision, "approved");
  assert.match(result.history[0].decidedAt, /^\d{4}-\d{2}-\d{2}T/);

  const persisted = readApprovalStore(storePath);
  assert.equal(persisted.pending.length, 0);
  assert.equal(persisted.history[0].decision, decision);

  rmSync(path.dirname(storePath), { recursive: true, force: true });
});

test("applyApprovalDecision rejects unknown approval ids", () => {
  const storePath = makeTempStore();

  writeApprovalStore({ pending: [], history: [] }, storePath);

  assert.throws(
    () => applyApprovalDecision("missing-id", "rejected", storePath),
    /Approval not found: missing-id/,
  );

  rmSync(path.dirname(storePath), { recursive: true, force: true });
});
