import type { TaskSignal } from "./mission-data";

export type CommandItem = {
  id: string;
  label: string;
  href: string;
  section: "Navigate" | "Projects" | "Tasks";
  keywords?: string[];
};

type CommandData = {
  tasks?: Pick<TaskSignal, "id" | "title" | "lane" | "assignee" | "priority" | "project">[];
};

const baseCommandItems: CommandItem[] = [
  { id: "office", label: "Office", href: "/office", section: "Navigate", keywords: ["home", "headquarters"] },
  { id: "projects", label: "Projects", href: "/projects", section: "Navigate", keywords: ["portfolio"] },
  {
    id: "project-hermes-mission-control",
    label: "Hermes Mission Control",
    href: "/projects/hermes-mission-control",
    section: "Projects",
    keywords: ["mission", "control", "project"],
  },
  { id: "tasks", label: "Tasks", href: "/tasks", section: "Navigate", keywords: ["kanban", "work"] },
  { id: "approvals", label: "Approvals", href: "/approvals", section: "Navigate", keywords: ["review", "decisions"] },
];

const priorityRank: Record<TaskSignal["priority"], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const laneRank: Record<TaskSignal["lane"], number> = {
  "In progress": 0,
  Blocked: 1,
  Ready: 2,
  Backlog: 3,
  Done: 4,
};

export function buildCommandItems(data: CommandData = {}): CommandItem[] {
  const taskItems = [...(data.tasks ?? [])]
    .sort((left, right) => {
      const priorityDelta = priorityRank[left.priority] - priorityRank[right.priority];
      if (priorityDelta !== 0) return priorityDelta;
      return laneRank[left.lane] - laneRank[right.lane];
    })
    .slice(0, 5)
    .map<CommandItem>((task) => ({
      id: `task-${task.id}`,
      label: task.title,
      href: `/tasks/${task.id}`,
      section: "Tasks",
      keywords: [task.id, task.lane, task.assignee, task.priority, task.project],
    }));

  return [...baseCommandItems, ...taskItems];
}

export function filterCommandItems(items: CommandItem[], query: string): CommandItem[] {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) return items;

  return items.filter((item) => {
    const haystack = [item.label, item.href, item.section, ...(item.keywords ?? [])].join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
