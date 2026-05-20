import Link from "next/link";
import { MissionShell } from "@/components/mission-shell";
import { PageHeader, Panel, ProgressBar, TonePill } from "@/components/ui";
import { buildCommandItems } from "@/lib/command-items";
import { getMissionData } from "@/lib/mission-data";
import { slugifyProjectName } from "@/lib/mission-store";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const data = getMissionData();

  return (
    <MissionShell commandItems={buildCommandItems(data)}>
      <PageHeader
        title="Projects"
        subtitle="Local portfolio and build streams Mission Control is tracking."
        aside={<TonePill tone="blue">{data.projects.length} active</TonePill>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {data.projects.map((project) => (
          <Panel key={project.name} className="p-5 transition hover:border-blue-400/25 hover:bg-[#181820]">
            <Link href={`/projects/${slugifyProjectName(project.name)}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">Owner: {project.owner}</p>
                </div>
                <TonePill>{project.status}</TonePill>
              </div>

              <p className="min-h-16 text-sm leading-6 text-zinc-300">{project.detail}</p>
              <p className="mt-4 truncate rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-zinc-500">{project.path}</p>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Progress signal</span>
                  <span>{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} />
              </div>
              <p className="mt-4 text-xs font-medium text-blue-300">Open project detail →</p>
            </Link>
          </Panel>
        ))}
      </div>

      <Panel className="mt-5 p-5">
        <h2 className="text-lg font-semibold">Next project-data step</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Add editable project records and connect each project to tasks, sessions, docs, and approvals. For now this page uses safe local metadata and hand-authored prototype records.
        </p>
      </Panel>
    </MissionShell>
  );
}
