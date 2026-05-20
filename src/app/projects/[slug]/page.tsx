import { notFound } from "next/navigation";
import { MissionShell } from "@/components/mission-shell";
import { PageHeader, Panel, ProgressBar, StatusDot, TonePill } from "@/components/ui";
import { buildCommandItems } from "@/lib/command-items";
import { getProjectDetailData, type ApprovalSignal, type TaskSignal } from "@/lib/mission-data";

export const dynamic = "force-dynamic";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
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

const activityDot = {
  emerald: "bg-emerald-300 text-emerald-300",
  blue: "bg-blue-300 text-blue-300",
  amber: "bg-amber-300 text-amber-300",
  violet: "bg-violet-300 text-violet-300",
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const detail = getProjectDetailData(slug);

  if (!detail) notFound();

  const { project, activeTasks, pendingApprovals, recentActivity, nextRecommendedAction } = detail;

  return (
    <MissionShell commandItems={buildCommandItems({ tasks: activeTasks })}>
      <PageHeader
        title={project.name}
        subtitle="Project cockpit with local status, active work, approvals, and recent mission signals."
        aside={<TonePill tone="blue">Project detail</TonePill>}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <Panel className="p-5">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Project signal</h2>
                <p className="mt-1 text-sm text-zinc-500">Owner: {project.owner}</p>
              </div>
              <TonePill>{project.status}</TonePill>
            </div>

            <p className="text-sm leading-6 text-zinc-300">{project.detail}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-600">Path</p>
                <p className="mt-2 break-words text-sm text-zinc-300">{project.path}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={project.progress} />
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active tasks</h2>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-zinc-500">{activeTasks.length}</span>
            </div>

            <div className="space-y-3">
              {activeTasks.map((task) => (
                <article key={task.id} className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <TonePill tone={laneTone[task.lane]}>{task.lane}</TonePill>
                    <TonePill tone={priorityTone[task.priority]}>{task.priority}</TonePill>
                    <TonePill tone="blue">{task.assignee}</TonePill>
                  </div>
                  <h3 className="text-sm font-semibold leading-5">{task.title}</h3>
                </article>
              ))}

              {activeTasks.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-4 text-sm text-zinc-600">No active tasks for this project yet.</div>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel className="border-blue-400/15 bg-blue-400/[0.05] p-5">
            <p className="text-xs uppercase tracking-wide text-blue-200/70">Next recommended action</p>
            <h2 className="mt-3 text-xl font-semibold text-blue-50">{nextRecommendedAction}</h2>
            <p className="mt-3 text-sm leading-6 text-blue-100/70">
              Use this panel to keep the project moving toward live Mission Control data instead of hand-authored prototype records.
            </p>
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
                <div className="rounded-xl border border-dashed border-white/[0.08] p-4 text-sm text-zinc-600">No pending approvals for this project right now.</div>
              )}
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <div className="mt-4 space-y-4">
              {recentActivity.map((activity) => (
                <article key={`${activity.actor}-${activity.event}`} className="flex gap-3">
                  <div className="pt-1">
                    <StatusDot color={activityDot[activity.tone]} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{activity.event}</h3>
                      <span className="text-xs text-zinc-600">{activity.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{activity.actor}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{activity.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </MissionShell>
  );
}
