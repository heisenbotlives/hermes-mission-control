import type { ActivitySignal, TaskSignal } from "./mission-data";
import { getMissionData } from "./mission-data";

export type HermesAdapterMode = "local-safe-stub";

export type HermesAdapterSnapshot = {
  mode: HermesAdapterMode;
  source: string;
  tasks: TaskSignal[];
  activity: ActivitySignal[];
  warnings: string[];
};

export type KanbanTaskInput = {
  id: string;
  title: string;
  status?: string;
  assignee?: string;
  priority?: string;
  project?: string;
};

type HermesAdapterOptions = {
  tasks?: TaskSignal[];
  activity?: ActivitySignal[];
};

const statusToLane: Record<string, TaskSignal["lane"]> = {
  backlog: "Backlog",
  todo: "Backlog",
  ready: "Ready",
  doing: "In progress",
  "in-progress": "In progress",
  "in progress": "In progress",
  blocked: "Blocked",
  done: "Done",
  complete: "Done",
  completed: "Done",
};

const priorityToSignal: Record<string, TaskSignal["priority"]> = {
  low: "Low",
  medium: "Medium",
  med: "Medium",
  high: "High",
  urgent: "High",
  critical: "High",
};

export function mapKanbanTaskToTaskSignal(task: KanbanTaskInput): TaskSignal {
  const status = task.status?.trim().toLowerCase() ?? "backlog";
  const priority = task.priority?.trim().toLowerCase() ?? "medium";

  return {
    id: task.id,
    title: task.title,
    lane: statusToLane[status] ?? "Backlog",
    assignee: task.assignee ?? "Unassigned",
    priority: priorityToSignal[priority] ?? "Medium",
    project: task.project ?? "Unassigned",
  };
}

export function getHermesAdapterSnapshot(options: HermesAdapterOptions = {}): HermesAdapterSnapshot {
  const missionData = options.tasks && options.activity ? undefined : getMissionData();

  return {
    mode: "local-safe-stub",
    source: "Mission Control local data",
    tasks: options.tasks ?? missionData?.tasks ?? [],
    activity: options.activity ?? missionData?.activity ?? [],
    warnings: [
      "Real Hermes/Kanban integration is not connected yet; this adapter only exposes safe local Mission Control data.",
      "Adapter stub does not inspect secrets, auth files, browser sessions, env files, or broad folders.",
    ],
  };
}
