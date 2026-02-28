"use client";

import { Stage } from "@/lib/types";

const STAGES: { key: Stage; label: string }[] = [
  { key: "triggered", label: "Triggered" },
  { key: "researching", label: "Researching" },
  { key: "writing", label: "Writing" },
  { key: "generating_images", label: "Images" },
  { key: "complete", label: "Complete" },
];

const STAGE_ORDER: Record<Stage, number> = {
  triggered: 0,
  researching: 1,
  writing: 2,
  generating_images: 3,
  complete: 4,
  error: -1,
};

interface ProgressTrackerProps {
  stage: Stage;
}

export default function ProgressTracker({ stage }: ProgressTrackerProps) {
  const currentIndex = STAGE_ORDER[stage];

  if (stage === "error") {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <p className="text-red-400 font-medium">Workflow encountered an error</p>
      </div>
    );
  }

  return (
    <div className="bg-[#12122a] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between">
        {STAGES.map((s, i) => {
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex && stage !== "complete";
          const isLast = i === STAGES.length - 1;
          const isFinalComplete = stage === "complete" && i === STAGES.length - 1;

          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted || isFinalComplete
                      ? "bg-[#e94560] border-[#e94560] text-white"
                      : isActive
                        ? "border-[#e94560] text-[#e94560] animate-pulse"
                        : "border-gray-600 text-gray-600"
                  }`}
                >
                  {isCompleted || isFinalComplete ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium whitespace-nowrap ${
                    isCompleted || isFinalComplete
                      ? "text-[#e94560]"
                      : isActive
                        ? "text-white"
                        : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-3 mt-[-20px] transition-colors duration-500 ${
                    isCompleted ? "bg-[#e94560]" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
