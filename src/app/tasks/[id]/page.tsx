import Link from "next/link";
import { notFound } from "next/navigation";
import { MissionShell } from "@/components/mission-shell";
import { PageHeader, Panel, ProgressBar, TonePill } from "@/components/ui";
import { buildCommandItems } from "@/lib/command-items";
import { getTaskDetailData, type ApprovalSignal, type TaskSignal } from "@/lib/mission-data";

export const dynamic = "force-dynamic";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

const priorityTone: Record<TaskSignal["priority"], "neutral" | "amber" | "red"> = {
  Low: "neutral",
  Medium: "amber",
  High: "red",
};

const laneTone: Record<TaskSignal["lane"], "neutral" | "green" | "blue" | "amber" | "red" | "violet"> = {
  Backlog: "neutral",
  Ready: "blue",
  "In progress": "violet",
  Blocked: "red",
  Done: "green",
};

const riskTone: Record<ApprovalSignal["risk"], "green" | "amber" | "red"> = {
  low: "green",
  medium: "amber",
  high: "red",
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const detail = getTaskDetailData(id);

  if (!detail) notFound();

  const { task, project, projectSlug, pendingApprovals, nextRecommendedAction, relatedActivity } = detail;

  return (
    <MissionShell commandItems={buildCommandItems({ tasks: [task] })}>
      <PageHeader
        title={task.title}
        subtitle="Task cockpit with lane, ownership, project context, next action, and approval signals."
        aside={<TonePill tone={laneTone[task.lane]}>{task.lane}</TonePill>}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <Panel className="p-5">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Task signal</h2>
                <p className="mt-1 text-sm text-zinc-500">ID: {task.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TonePill tone={priorityTone[task.priority]}>{task.priority} priority</TonePill>
                <TonePill tone="blue">{task.assignee}</TonePill>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-600">Status lane</p>
                <p className="mt-2 text-sm font-medium text-zinc-200">{task.lane}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-600">Project</p>
                {projectSlug ? (
                  <Link className="mt-2 inline-block text-sm font-medium text-blue-200 hover:text-blue-100" href={`/projects/${projectSlug}`}>
                    {task.project}
                  </Link>
                ) : (
                  <p className="mt-2 text-sm font-medium text-zinc-300">{task.project}</p>
                )}
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="text-lg font-semibold">Related project context</h2>
            {project ? (
              <div className="mt-4 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Link className="text-base font-semibold text-blue-200 hover:text-blue-100" href={`/projects/${projectSlug}`}>
                      {project.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-500">Owner: {project.owner}</p>
                  </div>
                  <TonePill>{project.status}</TonePill>
                </div>
                <p className="text-sm leading-6 text-zinc-400">{project.detail}</p>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] p-4 text-sm text-zinc-600">
                No matching project record exists yet for this task.
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel className="border-blue-400/15 bg-blue-400/[0.05] p-5">
            <p className="text-xs uppercase tracking-wide text-blue-200/70">Suggested next action</p>
            <h2 className="mt-3 text-xl font-semibold text-blue-50">{nextRecommendedAction}</h2>
            <p className="mt-3 text-sm leading-6 text-blue-100/70">Recommendation is derived from the task lane so the next operational move stays explicit.</p>
          </Panel>

          <Panel className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pending approvals</h2>
              <TonePill tone={pendingApprovals.length > 0 ? "amber" : "neutral"}>{pendingApprovals.length}</TonePill>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <article key={approval.id} className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <TonePill tone={riskTone[approval.risk]}>{approval.risk} risk</TonePill>
                    <TonePill>{approval.status}</TonePill>
                  </div>
                  <h3 className="text-sm font-semibold leading-5">{approval.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{approval.whyItMatters}</p>
                </article>
              ))}

              {pendingApprovals.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-4 text-sm text-zinc-600">No pending approvals are blocking this task right now.</div>
              )}
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="text-lg font-semibold">Recent mission context</h2>
            <div className="mt-4 space-y-3">
              {relatedActivity.map((activity) => (
                <article key={`${activity.actor}-${activity.event}`} className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">{activity.event}</h3>
                    <span className="text-xs text-zinc-600">{activity.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{activity.actor}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{activity.detail}</p>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </MissionShell>
  );
}
