import { NextRequest, NextResponse } from "next/server";
import { getSession, setSession } from "@/lib/sessionStore";
import { WebhookUpdatePayload } from "@/lib/types";

export async function POST(request: NextRequest) {
  const payload: WebhookUpdatePayload = await request.json();
  const {
    sessionId,
    stage,
    research,
    newsletter,
    htmlEmail,
    linkedinPost,
    emailSubject,
    error,
  } = payload;

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 }
    );
  }

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  if (stage) session.stage = stage;
  session.updatedAt = Date.now();
  if (research) session.research = research;
  if (newsletter) session.newsletter = newsletter;
  if (htmlEmail) session.htmlEmail = htmlEmail;
  if (linkedinPost) session.linkedinPost = linkedinPost;
  if (emailSubject) session.emailSubject = emailSubject;
  if (error) session.error = error;

  await setSession(session);

  return NextResponse.json({ received: true });
}
