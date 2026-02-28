import StatusPollingProvider from "@/components/StatusPollingProvider";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Newsletter <span className="text-[#e94560]">Generator</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Enter a brand name and description to generate a full newsletter with
            AI-powered research, images, Gmail draft, and LinkedIn post.
          </p>
        </div>

        {/* Main Content */}
        <StatusPollingProvider />
      </div>
    </main>
  );
}
