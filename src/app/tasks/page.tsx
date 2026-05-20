import Link from "next/link";
import { MissionShell } from "@/components/mission-shell";
import { PageHeader, Panel, TonePill } from "@/components/ui";
import { buildCommandItems } from "@/lib/command-items";
import { getMissionData, type TaskSignal } from "@/lib/mission-data";

export const dynamic = "force-dynamic";

const lanes: TaskSignal["lane"][] = ["Backlog", "Ready", "In progress", "Blocked", "Done"];

const priorityTone: Record<TaskSignal["priority"], "neutral" | "amber" | "red"> = {
  Low: "neutral",
  Medium: "amber",
  High: "red",
};

export default function TasksPage() {
  const data = getMissionData();

  return (
    <MissionShell commandItems={buildCommandItems(data)}>
      <PageHeader
        title="Tasks"
        subtitle="A first Kanban-style view of Mission Control work. Real Hermes/Kanban integration comes next."
        aside={<TonePill tone="violet">{data.tasks.length} tracked</TonePill>}
      />

      <div className="grid gap-4 xl:grid-cols-5">
        {lanes.map((lane) => {
          const laneTasks = data.tasks.filter((task) => task.lane === lane);

          return (
            <Panel key={lane} className="min-h-72 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-200">{lane}</h2>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-zinc-500">{laneTasks.length}</span>
              </div>

              <div className="space-y-3">
                {laneTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block rounded-xl border border-white/[0.06] bg-black/20 p-4 transition hover:border-blue-400/40 hover:bg-blue-400/[0.05] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                  >
                    <article>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <TonePill tone={priorityTone[task.priority]}>{task.priority}</TonePill>
                        <TonePill tone="blue">{task.assignee}</TonePill>
                      </div>
                      <h3 className="text-sm font-semibold leading-5">{task.title}</h3>
                      <p className="mt-3 text-xs text-zinc-500">{task.project}</p>
                    </article>
                  </Link>
                ))}

                {laneTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/[0.08] p-4 text-sm text-zinc-600">No tasks yet.</div>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </MissionShell>
  );
}
