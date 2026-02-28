"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "@/lib/types";
import InputForm from "./InputForm";
import ProgressTracker from "./ProgressTracker";
import ResearchPanel from "./ResearchPanel";
import NewsletterPreview from "./NewsletterPreview";
import LinkedInPost from "./LinkedInPost";

export default function StatusPollingProvider() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (brandName: string, brandDescription: string, recipientEmail: string) => {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandName, brandDescription, recipientEmail }),
        });
        const data = await res.json();
        if (data.sessionId) {
          setSessionId(data.sessionId);
          setSession({
            sessionId: data.sessionId,
            brandName,
            brandDescription,
            stage: data.status || "triggered",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            research: null,
            newsletter: null,
            htmlEmail: null,
            linkedinPost: null,
            emailSubject: null,
            error: data.error ?? null,
          });
        }
      } catch {
        setSession(null);
        setSessionId(null);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setSessionId(null);
    setSession(null);
  }, []);

  // Polling — stops at complete/error or after 20 minutes (400 × 3s)
  useEffect(() => {
    if (!sessionId) return;
    if (session?.stage === "complete" || session?.stage === "error") return;

    let pollCount = 0;
    const MAX_POLLS = 400;

    const interval = setInterval(async () => {
      pollCount++;
      if (pollCount > MAX_POLLS) {
        clearInterval(interval);
        setSession((prev) =>
          prev
            ? { ...prev, stage: "error", error: "Workflow timed out after 20 minutes. The n8n workflow may have stalled — check your n8n execution logs." }
            : prev
        );
        return;
      }
      try {
        const res = await fetch(`/api/status/${sessionId}`);
        if (res.ok) {
          const data: Session = await res.json();
          setSession(data);
        }
      } catch {
        // Silently retry on next interval
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, session?.stage]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-[#12122a] rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">
          Create Newsletter
        </h2>
        <InputForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          disabled={!!sessionId}
          onReset={handleReset}
        />
      </div>

      {/* Progress */}
      {session && <ProgressTracker stage={session.stage} />}

      {/* Active status message */}
      {session &&
        session.stage !== "complete" &&
        session.stage !== "error" && (
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <svg
              className="animate-spin h-4 w-4 text-[#e94560]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>
              {session.stage === "triggered" && "Workflow triggered, starting research..."}
              {session.stage === "researching" && "Research complete! Writing newsletter with AI..."}
              {session.stage === "writing" && "Newsletter written! Generating images..."}
              {session.stage === "generating_images" && "Generating images for each section..."}
            </span>
          </div>
        )}

      {/* Error */}
      {session?.stage === "error" && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-5">
          <h3 className="text-red-400 font-semibold mb-1">Error</h3>
          <p className="text-red-300 text-sm">{session.error || "An unknown error occurred."}</p>
        </div>
      )}

      {/* Research Data */}
      {session?.research && <ResearchPanel research={session.research} />}

      {/* Newsletter Preview */}
      {session?.htmlEmail && (
        <NewsletterPreview
          html={session.htmlEmail}
          subject={session.emailSubject}
        />
      )}

      {/* LinkedIn Post */}
      {session?.linkedinPost && <LinkedInPost text={session.linkedinPost} />}

      {/* Completion message */}
      {session?.stage === "complete" && (
        <div className="bg-green-900/20 border border-green-800 rounded-xl p-5 text-center">
          <h3 className="text-green-400 font-semibold text-lg mb-1">
            Newsletter Generated Successfully!
          </h3>
          <p className="text-green-300/70 text-sm">
            Newsletter sent to your email. Gmail draft also created. LinkedIn post ready to copy.
          </p>
        </div>
      )}
    </div>
  );
}
