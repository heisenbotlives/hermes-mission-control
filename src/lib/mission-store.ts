import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { type ProjectSignal, type TaskSignal } from "./mission-data";

export type { ProjectSignal, TaskSignal } from "./mission-data";

export type MissionStore = {
  projects: ProjectSignal[];
  tasks: TaskSignal[];
};

const defaultProjects: ProjectSignal[] = [
  {
    name: "Hermes Mission Control",
    status: "Local store seeded",
    path: process.cwd(),
    detail: "First managed project; seeded from safe local defaults.",
    progress: 58,
    owner: "Hermes + Luke",
  },
  {
    name: "Story app",
    status: "Planned",
    path: "Documents/story-app",
    detail: "Project placeholder waiting for local repository metadata.",
    progress: 12,
    owner: "Product build",
  },
  {
    name: "AI marketing army",
    status: "Planning",
    path: "Obsidian / future repo",
    detail: "Portfolio operating-system concept waiting for structured project pages.",
    progress: 38,
    owner: "Strategy agents",
  },
];

const defaultTasks: TaskSignal[] = [
  {
    id: "routes",
    title: "Create real left-nav routes",
    lane: "Done",
    assignee: "Codex",
    priority: "High",
    project: "Hermes Mission Control",
  },
  {
    id: "approvals-page",
    title: "Build approval inbox detail page",
    lane: "In progress",
    assignee: "Quill",
    priority: "High",
    project: "Hermes Mission Control",
  },
  {
    id: "kanban-mapping",
    title: "Map Hermes Kanban data model",
    lane: "Ready",
    assignee: "Echo",
    priority: "High",
    project: "Hermes Mission Control",
  },
  {
    id: "project-pages",
    title: "Turn portfolio ideas into project pages",
    lane: "Ready",
    assignee: "Scout",
    priority: "Medium",
    project: "AI marketing army",
  },
  {
    id: "security-review",
    title: "Review editor extensions manually",
    lane: "Blocked",
    assignee: "Reviewer",
    priority: "Medium",
    project: "Hermes security",
  },
];

function cloneStore(store: MissionStore): MissionStore {
  return JSON.parse(JSON.stringify(store)) as MissionStore;
}

export function createDefaultMissionStore(): MissionStore {
  return cloneStore({
    projects: defaultProjects,
    tasks: defaultTasks,
  });
}

export function missionStorePath() {
  // Prefer an exact file override for tests and local automation. Fall back to a
  // data-directory override before using the project-root data directory.
  if (process.env.MISSION_CONTROL_STORE_PATH) {
    return process.env.MISSION_CONTROL_STORE_PATH;
  }

  if (process.env.MISSION_CONTROL_DATA_DIR) {
    return path.join(process.env.MISSION_CONTROL_DATA_DIR, "mission-store.json");
  }

  return path.join(process.cwd(), "data", "mission-store.json");
}

export function writeMissionStore(store: MissionStore, storePath = missionStorePath()) {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export function readMissionStore(defaultStore: MissionStore = createDefaultMissionStore(), storePath = missionStorePath()): MissionStore {
  if (!existsSync(storePath)) {
    const initialStore = cloneStore(defaultStore);
    writeMissionStore(initialStore, storePath);
    return initialStore;
  }

  const raw = readFileSync(storePath, "utf8");
  const parsed = JSON.parse(raw) as Partial<MissionStore>;

  return {
    projects: parsed.projects ?? [],
    tasks: parsed.tasks ?? [],
  };
}

export function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findProjectBySlug(slug: string, store = readMissionStore()) {
  return store.projects.find((project) => slugifyProjectName(project.name) === slug);
}

export function findTaskById(id: string, store = readMissionStore()) {
  return store.tasks.find((task) => task.id === id);
}
