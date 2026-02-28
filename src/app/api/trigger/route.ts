import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { setSession } from "@/lib/sessionStore";
import { Session } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { brandName, brandDescription } = body;

  if (!brandName?.trim() || !brandDescription?.trim()) {
    return NextResponse.json(
      { error: "brandName and brandDescription are required" },
      { status: 400 }
    );
  }

  const sessionId = randomUUID();
  const callbackUrl =
    process.env.CALLBACK_BASE_URL || request.nextUrl.origin;

  const session: Session = {
    sessionId,
    brandName: brandName.trim(),
    brandDescription: brandDescription.trim(),
    stage: "triggered",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    research: null,
    newsletter: null,
    htmlEmail: null,
    linkedinPost: null,
    emailSubject: null,
    error: null,
  };

  await setSession(session);

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!n8nWebhookUrl) {
    session.stage = "error";
    session.error = "N8N_WEBHOOK_URL is not configured";
    await setSession(session);
    return NextResponse.json({ sessionId, status: session.stage });
  }

  try {
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName: brandName.trim(),
        brandDescription: brandDescription.trim(),
        callbackUrl,
        sessionId,
      }),
    });

    if (!n8nResponse.ok) {
      session.stage = "error";
      session.error = `n8n returned status ${n8nResponse.status}`;
      await setSession(session);
    }
  } catch (err: unknown) {
    session.stage = "error";
    session.error = `Failed to reach n8n: ${err instanceof Error ? err.message : "Unknown error"}`;
    await setSession(session);
  }

  return NextResponse.json({ sessionId, status: session.stage });
}
