import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";
import test from "node:test";

import {
  findProjectBySlug,
  findTaskById,
  missionStorePath,
  readMissionStore,
  slugifyProjectName,
  type MissionStore,
  writeMissionStore,
} from "../src/lib/mission-store";

function tempStorePath() {
  const dir = mkdtempSync(path.join(tmpdir(), "mission-store-test-"));
  return {
    dir,
    storePath: path.join(dir, "nested", "mission-store.json"),
    cleanup: () => rmSync(dir, { recursive: true, force: true }),
  };
}

const seedStore: MissionStore = {
  projects: [
    {
      name: "Hermes Mission Control",
      status: "Testing",
      path: "/tmp/hermes-mission-control",
      detail: "Seeded in a test temp dir.",
      progress: 42,
      owner: "Hermes + Luke",
    },
  ],
  tasks: [
    {
      id: "local-json-store",
      title: "Create local JSON mission store",
      lane: "Ready",
      assignee: "Codex",
      priority: "High",
      project: "Hermes Mission Control",
    },
  ],
};

test("slugifyProjectName creates stable lowercase slugs", () => {
  assert.equal(slugifyProjectName("Hermes Mission Control"), "hermes-mission-control");
  assert.equal(slugifyProjectName("  AI marketing army!!  "), "ai-marketing-army");
  assert.equal(slugifyProjectName("Hermes_security/review"), "hermes-security-review");
});

test("readMissionStore creates and seeds a missing temp store", () => {
  const { storePath, cleanup } = tempStorePath();
  try {
    assert.equal(existsSync(storePath), false);

    const store = readMissionStore(seedStore, storePath);

    assert.deepEqual(store, seedStore);
    assert.equal(existsSync(storePath), true);
    assert.deepEqual(JSON.parse(readFileSync(storePath, "utf8")), seedStore);
  } finally {
    cleanup();
  }
});

test("writeMissionStore creates parent dirs and writes pretty JSON", () => {
  const { storePath, cleanup } = tempStorePath();
  try {
    writeMissionStore(seedStore, storePath);

    const raw = readFileSync(storePath, "utf8");
    assert.match(raw, /^\{\n  "projects": \[/);
    assert.match(raw, /\n}\n$/);
    assert.deepEqual(JSON.parse(raw), seedStore);
  } finally {
    cleanup();
  }
});

test("readMissionStore reads existing JSON", () => {
  const { storePath, cleanup } = tempStorePath();
  try {
    writeMissionStore(seedStore, storePath);

    const store = readMissionStore(undefined, storePath);

    assert.deepEqual(store, seedStore);
  } finally {
    cleanup();
  }
});

test("readMissionStore fills missing arrays safely", () => {
  const { storePath, cleanup } = tempStorePath();
  try {
    mkdirSync(path.dirname(storePath), { recursive: true });
    writeFileSync(storePath, JSON.stringify({ projects: seedStore.projects }), "utf8");

    const store = readMissionStore(undefined, storePath);

    assert.deepEqual(store, { projects: seedStore.projects, tasks: [] });
  } finally {
    cleanup();
  }
});

test("lookup helpers can use provided stores without touching disk", () => {
  assert.deepEqual(findProjectBySlug("hermes-mission-control", seedStore), seedStore.projects[0]);
  assert.deepEqual(findTaskById("local-json-store", seedStore), seedStore.tasks[0]);
  assert.equal(findProjectBySlug("missing", seedStore), undefined);
  assert.equal(findTaskById("missing", seedStore), undefined);
});

test("missionStorePath prefers exact path env override, then data dir fallback", async () => {
  const originalStorePath = process.env.MISSION_CONTROL_STORE_PATH;
  const originalDataDir = process.env.MISSION_CONTROL_DATA_DIR;
  try {
    process.env.MISSION_CONTROL_STORE_PATH = path.join(tmpdir(), "exact-mission-store.json");
    process.env.MISSION_CONTROL_DATA_DIR = path.join(tmpdir(), "mission-data-dir");
    assert.equal(missionStorePath(), process.env.MISSION_CONTROL_STORE_PATH);

    delete process.env.MISSION_CONTROL_STORE_PATH;
    assert.equal(missionStorePath(), path.join(process.env.MISSION_CONTROL_DATA_DIR!, "mission-store.json"));
  } finally {
    if (originalStorePath === undefined) delete process.env.MISSION_CONTROL_STORE_PATH;
    else process.env.MISSION_CONTROL_STORE_PATH = originalStorePath;

    if (originalDataDir === undefined) delete process.env.MISSION_CONTROL_DATA_DIR;
    else process.env.MISSION_CONTROL_DATA_DIR = originalDataDir;
  }
});
