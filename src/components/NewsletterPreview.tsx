"use client";

import { useRef, useEffect } from "react";

interface NewsletterPreviewProps {
  html: string;
  subject: string | null;
}

export default function NewsletterPreview({
  html,
  subject,
}: NewsletterPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <div className="bg-[#12122a] rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-900/50 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Newsletter Preview</h2>
          {subject && (
            <p className="text-sm text-gray-400 mt-0.5">
              Subject: {subject}
            </p>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            className="w-full border-0"
            style={{ height: "700px" }}
            sandbox="allow-same-origin"
            title="Newsletter Preview"
          />
        </div>
      </div>
      <div className="px-6 pb-4">
        <p className="text-xs text-gray-500">
          A Gmail draft has been created. Check your drafts folder to review and send.
        </p>
      </div>
    </div>
  );
}
