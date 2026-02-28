"use client";

import { useState } from "react";
import { ResearchData } from "@/lib/types";

interface ResearchPanelProps {
  research: ResearchData;
}

export default function ResearchPanel({ research }: ResearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-[#12122a] rounded-xl border border-gray-800 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#1a1a2e] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-900/50 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Research Data</h2>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Perplexity Research */}
          <div>
            <h3 className="text-sm font-semibold text-[#e94560] uppercase tracking-wider mb-3">
              Perplexity Deep Research
            </h3>
            <div className="bg-[#0a0a1a] rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {research.perplexity}
              </div>
            </div>
            {research.citations && research.citations.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Sources ({research.citations.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {research.citations.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 px-2 py-1 rounded truncate max-w-xs"
                    >
                      [{i + 1}] {url}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Google News */}
          {research.googleNews && research.googleNews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#e94560] uppercase tracking-wider mb-3">
                Google News ({research.googleNews.length} articles)
              </h3>
              <div className="grid gap-3">
                {research.googleNews.map((article, i) => (
                  <a
                    key={i}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#0a0a1a] rounded-lg p-4 hover:bg-[#16162a] transition-colors group"
                  >
                    <h4 className="text-sm font-medium text-white group-hover:text-[#e94560] transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    {article.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    {article.pubDate && (
                      <p className="text-xs text-gray-600 mt-2">
                        {article.pubDate}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
