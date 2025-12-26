"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-lg w-full text-center">
          {/* Animated SVG Illustration */}
          <div className="mb-8">
            <svg
              className="w-64 h-64 mx-auto"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#013A8A"
                d="M42.7,-63.8C55.3,-55.8,65.1,-42.7,70.8,-27.3C76.5,-11.9,78.1,5.9,73.8,21.9C69.5,37.9,59.3,52.1,45.4,61.2C31.5,70.3,13.8,74.3,-2.1,77.1C-18,79.9,-36,81.5,-49.2,73.5C-62.4,65.5,-70.8,47.9,-75.2,29.6C-79.6,11.3,-80.1,-7.8,-74.3,-24.2C-68.6,-40.6,-56.6,-54.4,-42.3,-61.9C-28,-69.5,-14,-70.8,0.7,-71.8C15.3,-72.9,30.1,-73.8,42.7,-63.8Z"
                transform="translate(100 100)"
              />
              <text
                x="100"
                y="100"
                fontFamily="Arial"
                fontSize="28"
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                500
              </text>
            </svg>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-8">
            We apologize for the inconvenience. Our team has been notified and
            is working to fix the issue.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-[#013A8A] text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-white text-[#013A8A] border border-[#013A8A] rounded-lg shadow-md hover:bg-blue-50 transition-colors duration-300 font-medium inline-block"
            >
              Go Home
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Error details:</p>
            <code className="text-xs text-gray-600 break-words">
              {error.message || "Unknown error"}
            </code>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Still having trouble?{" "}
            <Link href="/contact" className="text-[#013A8A] hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
