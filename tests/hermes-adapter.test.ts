import assert from "node:assert/strict";
import test from "node:test";

import { getHermesAdapterSnapshot, mapKanbanTaskToTaskSignal } from "../src/lib/hermes-adapter";
import type { TaskSignal } from "../src/lib/mission-data";

test("getHermesAdapterSnapshot exposes a local-safe stub mode", () => {
  const tasks: TaskSignal[] = [
    {
      id: "kanban-mapping",
      title: "Map Hermes Kanban data model",
      lane: "Ready",
      assignee: "Echo",
      priority: "High",
      project: "Hermes Mission Control",
    },
  ];

  const snapshot = getHermesAdapterSnapshot({ tasks });

  assert.equal(snapshot.mode, "local-safe-stub");
  assert.equal(snapshot.source, "Mission Control local data");
  assert.equal(snapshot.tasks.length, 1);
  assert.equal(snapshot.tasks[0].project, "Hermes Mission Control");
  assert.match(snapshot.warnings.join(" "), /real Hermes\/Kanban integration is not connected/i);
});

test("mapKanbanTaskToTaskSignal maps basic lane and priority safely", () => {
  const task = mapKanbanTaskToTaskSignal({
    id: "connect-kanban",
    title: "Connect real Kanban feed",
    status: "doing",
    assignee: "Echo",
    priority: "urgent",
    project: "Hermes Mission Control",
  });

  assert.deepEqual(task, {
    id: "connect-kanban",
    title: "Connect real Kanban feed",
    lane: "In progress",
    assignee: "Echo",
    priority: "High",
    project: "Hermes Mission Control",
  });
});
