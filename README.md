# Hermes Mission Control

A local-first command centre for coordinating Hermes agents, projects, tasks, approvals, and safe operator workflows.

This is an early prototype built as a practical personal dashboard first, with a public portfolio/demo direction second.

## What it does now

- **Office dashboard**: dark command-centre view for projects, agents, activity, approvals, and adapter status.
- **Project management**: project list plus project detail pages such as `/projects/hermes-mission-control`.
- **Task board**: Kanban-style task board plus task detail pages such as `/tasks/kanban-mapping`.
- **Approval inbox**: local approval decisions with approve/reject/ask-for-changes actions.
- **Command palette**: `Cmd/Ctrl + K` quick navigation for pages, projects, and tasks.
- **Local persistence**: approval and mission-store JSON files are runtime-only and gitignored.
- **Hermes/Kanban adapter stub**: safe integration boundary marked `local-safe-stub` until real Hermes/Kanban data is connected.

## Architecture direction

Mission Control is designed to sit on top of the existing Hermes workflow rather than replace it:

- **Mission Control UI**: human operator dashboard.
- **Hermes/Kanban**: durable task/work backend.
- **Hermes agents**: execution engine.
- **Local JSON store**: simple first persistence layer for early iteration.
- **Obsidian/private notes**: long-term thinking and private knowledge base outside this public repo.

## Safety posture

This repo is intended to be safe for public viewing:

- Runtime files under `data/` are ignored.
- `.env*` files are ignored.
- The Hermes/Kanban adapter stub does not inspect secrets, browser sessions, auth files, env files, or broad folders.
- Approval decisions are stored locally and are not committed.

Before publishing, the repo was scanned for obvious hardcoded secrets in the current tree and git history.

## Tech stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Node test runner via `tsx`

## Getting started

```bash
npm install
npm run dev -- --hostname 127.0.0.1
```

Open:

```text
http://127.0.0.1:3000
```

## Useful commands

```bash
npm test
npm run lint
npm run build
```

## Current status

This is an active prototype. The next major step is replacing the safe local adapter stub with real Hermes/Kanban task/session data while keeping approval gates explicit for risky actions.
