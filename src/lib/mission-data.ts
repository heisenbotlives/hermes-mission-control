import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import * as path from "node:path";
import { readApprovalStore } from "./approval-store";

export type ProjectSignal = {
  name: string;
  status: string;
  path: string;
  detail: string;
  progress: number;
  owner: string;
};

export type ActivitySignal = {
  actor: string;
  event: string;
  detail: string;
  time: string;
  tone: "emerald" | "blue" | "amber" | "violet";
};

export type ApprovalSignal = {
  id: string;
  title: string;
  requester: string;
  risk: "low" | "medium" | "high";
  status: "Needs review" | "Queued" | "Draft";
  action: string;
  whyItMatters: string;
};

export type TaskSignal = {
  id: string;
  title: string;
  lane: "Backlog" | "Ready" | "In progress" | "Blocked" | "Done";
  assignee: string;
  priority: "Low" | "Medium" | "High";
  project: string;
};

const HOME = process.env.HOME ?? "/Users/heisenbot";
const missionRoot = process.cwd();

function safeGit(args: string[], cwd: string) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function dirStatus(dirPath: string) {
  if (!existsSync(dirPath)) {
    return { exists: false, mtime: "missing" };
  }

  const stats = statSync(dirPath);
  return {
    exists: true,
    mtime: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/London",
    }).format(stats.mtime),
  };
}

function gitCleanStatus(dirPath: string) {
  const status = safeGit(["status", "--short"], dirPath);
  if (!status) return "Clean working tree";
  return `${status.split("\n").length} changed file${status.split("\n").length === 1 ? "" : "s"}`;
}

export function getMissionData() {
  const missionStatus = dirStatus(missionRoot);
  const storyPath = path.join(HOME, "Documents/story-app");
  const storyStatus = dirStatus(storyPath);
  const latestCommit = safeGit(["log", "-1", "--pretty=%h %s"], missionRoot) || "No commit found";
  const branch = safeGit(["branch", "--show-current"], missionRoot) || "main";
  const packageVersion = path.join(missionRoot, "package.json");
  const packageStatus = dirStatus(packageVersion);

  const projects: ProjectSignal[] = [
    {
      name: "Hermes Mission Control",
      status: gitCleanStatus(missionRoot),
      path: missionRoot,
      detail: `First managed project; branch ${branch}; latest commit ${latestCommit}`,
      progress: 58,
      owner: "Hermes + Luke",
    },
    {
      name: "Story app",
      status: storyStatus.exists ? "Local repo found" : "Not found",
      path: storyPath,
      detail: storyStatus.exists ? `Last touched ${storyStatus.mtime}` : "Expected under Documents/story-app",
      progress: storyStatus.exists ? 64 : 12,
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

  const approvalStore = readApprovalStore();
  const approvals = approvalStore.pending;

  const tasks: TaskSignal[] = [
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

  const activity: ActivitySignal[] = [
    {
      actor: "quill",
      event: "prototype updated",
      detail: "Left-navigation office shell is now being split into real pages.",
      time: "now",
      tone: "violet",
    },
    {
      actor: "echo",
      event: "local data checked",
      detail: `Mission Control package file ${packageStatus.exists ? "found" : "missing"}; repo status: ${gitCleanStatus(missionRoot)}.`,
      time: "last run",
      tone: "blue",
    },
    {
      actor: "scout",
      event: "project signal found",
      detail: storyStatus.exists ? "Story app folder is available locally." : "Story app folder was not found in the expected location.",
      time: "last run",
      tone: "emerald",
    },
    {
      actor: "reviewer",
      event: "approval needed",
      detail: "Decide when to connect real Hermes task/session logs beyond safe local metadata.",
      time: "queued",
      tone: "amber",
    },
  ];

  return {
    projects,
    activity,
    approvals,
    approvalHistory: approvalStore.history,
    tasks,
    system: {
      branch,
      latestCommit,
      updatedAt: missionStatus.mtime,
    },
  };
}
