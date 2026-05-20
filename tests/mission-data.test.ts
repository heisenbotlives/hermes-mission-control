import assert from "node:assert/strict";
import test from "node:test";

import { getMissionData, getProjectDetailData, getTaskDetailData } from "../src/lib/mission-data";
import { findProjectBySlug, slugifyProjectName } from "../src/lib/mission-store";

test("Mission Control is the first managed project", () => {
  const data = getMissionData();
  const firstProject = data.projects[0];

  assert.equal(firstProject.name, "Hermes Mission Control");
  assert.equal(firstProject.owner, "Hermes + Luke");
  assert.match(firstProject.detail, /first managed project/i);
  assert.match(firstProject.path, /hermes-mission-control$/);
});

test("project routing helpers resolve the Mission Control slug", () => {
  const data = getMissionData();
  const firstProject = data.projects[0];

  assert.equal(slugifyProjectName(firstProject.name), "hermes-mission-control");
  assert.equal(findProjectBySlug("hermes-mission-control", { projects: data.projects, tasks: data.tasks })?.name, firstProject.name);
});

test("getProjectDetailData filters active tasks and recommends the next project action", () => {
  const detail = getProjectDetailData("hermes-mission-control");

  assert.equal(detail?.project.name, "Hermes Mission Control");
  assert.deepEqual(
    detail?.activeTasks.map((task) => task.id),
    ["approvals-page", "kanban-mapping"],
  );
  assert.equal(detail?.nextRecommendedAction, "Connect real Hermes/Kanban task data");
});

test("getProjectDetailData returns undefined for unknown slugs", () => {
  assert.equal(getProjectDetailData("unknown-project"), undefined);
});

test("getTaskDetailData resolves task detail with Mission Control project slug", () => {
  const detail = getTaskDetailData("kanban-mapping");

  assert.equal(detail?.task.title, "Map Hermes Kanban data model");
  assert.equal(detail?.project?.name, "Hermes Mission Control");
  assert.equal(detail?.projectSlug, "hermes-mission-control");
  assert.equal(detail?.nextRecommendedAction, "Start work on the next ready slice.");
});

test("getTaskDetailData returns undefined for unknown task ids", () => {
  assert.equal(getTaskDetailData("missing-task"), undefined);
});
