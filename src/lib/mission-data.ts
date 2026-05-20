import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

type ProjectSignal = {
  name: string;
  status: string;
  path: string;
  detail: string;
  progress: number;
};

type ActivitySignal = {
  actor: string;
  event: string;
  detail: string;
  time: string;
  tone: "emerald" | "blue" | "amber" | "violet";
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
      name: "Mission Control",
      status: gitCleanStatus(missionRoot),
      path: missionRoot,
      detail: `Branch ${branch}; latest commit ${latestCommit}`,
      progress: 46,
    },
    {
      name: "Story app",
      status: storyStatus.exists ? "Local repo found" : "Not found",
      path: storyPath,
      detail: storyStatus.exists ? `Last touched ${storyStatus.mtime}` : "Expected under Documents/story-app",
      progress: storyStatus.exists ? 64 : 12,
    },
    {
      name: "AI marketing army",
      status: "Planning",
      path: "Obsidian / future repo",
      detail: "Portfolio operating-system concept waiting for structured project pages.",
      progress: 38,
    },
  ];

  const activity: ActivitySignal[] = [
    {
      actor: "quill",
      event: "prototype updated",
      detail: "Left-navigation office shell is being wired into the app.",
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
    approvals: [
      "Connect real Hermes/Kanban task data?",
      "Add local SQLite persistence?",
      "Review GitHub token scope separately?",
    ],
    system: {
      branch,
      latestCommit,
      updatedAt: missionStatus.mtime,
    },
  };
}
