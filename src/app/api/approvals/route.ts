import { NextResponse } from "next/server";
import { applyApprovalDecision, readApprovalStore, type ApprovalDecision } from "@/lib/approval-store";

export const dynamic = "force-dynamic";

const decisions: ApprovalDecision[] = ["approved", "rejected", "changes_requested"];

export function GET() {
  return NextResponse.json(readApprovalStore());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: string; decision?: ApprovalDecision };

  if (!body.id || !body.decision || !decisions.includes(body.decision)) {
    return NextResponse.json({ error: "Expected id and decision" }, { status: 400 });
  }

  try {
    return NextResponse.json(applyApprovalDecision(body.id, body.decision));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to apply approval decision" },
      { status: 404 },
    );
  }
}
