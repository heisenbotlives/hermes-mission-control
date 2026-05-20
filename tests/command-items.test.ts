import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCommandItems, filterCommandItems, type CommandItem } from "../src/lib/command-items";
import type { TaskSignal } from "../src/lib/mission-data";

const tasks: TaskSignal[] = [
  {
    id: "low-backlog",
    title: "Document later ideas",
    lane: "Backlog",
    assignee: "Scout",
    priority: "Low",
    project: "Story app",
  },
  {
    id: "high-ready",
    title: "Ship command palette",
    lane: "Ready",
    assignee: "Codex",
    priority: "High",
    project: "Hermes Mission Control",
  },
  {
    id: "high-progress",
    title: "Finish approvals inbox",
    lane: "In progress",
    assignee: "Quill",
    priority: "High",
    project: "Hermes Mission Control",
  },
];

describe("buildCommandItems", () => {
  it("includes required top-level navigation and project links", () => {
    const items = buildCommandItems();

    assert.deepEqual(
      items.slice(0, 5).map((item) => [item.label, item.href]),
      [
        ["Office", "/office"],
        ["Projects", "/projects"],
        ["Hermes Mission Control", "/projects/hermes-mission-control"],
        ["Tasks", "/tasks"],
        ["Approvals", "/approvals"],
      ],
    );
  });

  it("adds important task links from mission data first", () => {
    const items = buildCommandItems({ tasks });
    const taskItems = items.filter((item) => item.section === "Tasks");

    assert.equal(taskItems[0]?.label, "Finish approvals inbox");
    assert.equal(taskItems[0]?.href, "/tasks/high-progress");
    assert.equal(taskItems[1]?.label, "Ship command palette");
    assert.equal(taskItems[1]?.href, "/tasks/high-ready");
  });
});

describe("filterCommandItems", () => {
  const items: CommandItem[] = buildCommandItems({ tasks });

  it("returns all items for an empty query", () => {
    assert.equal(filterCommandItems(items, "  ").length, items.length);
  });

  it("matches labels, hrefs, sections, and keywords case-insensitively", () => {
    assert.deepEqual(
      filterCommandItems(items, "CODEx").map((item) => item.href),
      ["/tasks/high-ready"],
    );

    assert.deepEqual(
      filterCommandItems(items, "mission control").map((item) => item.href),
      ["/projects/hermes-mission-control", "/tasks/high-progress", "/tasks/high-ready"],
    );
  });

  it("requires every query term to match", () => {
    assert.deepEqual(
      filterCommandItems(items, "tasks high-ready").map((item) => item.href),
      ["/tasks/high-ready"],
    );
  });
});
