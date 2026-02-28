"use client";

import { useState } from "react";

interface InputFormProps {
  onSubmit: (brandName: string, brandDescription: string) => void;
  isSubmitting: boolean;
  disabled: boolean;
  onReset: () => void;
}

export default function InputForm({
  onSubmit,
  isSubmitting,
  disabled,
  onReset,
}: InputFormProps) {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !brandDescription.trim()) return;
    onSubmit(brandName.trim(), brandDescription.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="brandName"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Brand Name
          </label>
          <input
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g., Tesla"
            disabled={disabled}
            className="w-full px-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560] transition-colors disabled:opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="brandDescription"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Brand Description
          </label>
          <input
            id="brandDescription"
            type="text"
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            placeholder="e.g., Electric vehicle and clean energy company"
            disabled={disabled}
            className="w-full px-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560] transition-colors disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={
            disabled || isSubmitting || !brandName.trim() || !brandDescription.trim()
          }
          className="px-6 py-3 bg-[#e94560] hover:bg-[#c13050] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
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
              Triggering...
            </>
          ) : (
            "Generate Newsletter"
          )}
        </button>

        {disabled && (
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-medium rounded-lg transition-colors"
          >
            New Newsletter
          </button>
        )}
      </div>
    </form>
  );
}
