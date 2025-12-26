"use client";

import { IoMdCheckmark } from "react-icons/io";

interface IncludedExcludedProps {
  included?: string;
  excluded?: string;
}

export default function IncludedExcluded({
  included,
  excluded,
}: IncludedExcludedProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        What&apos;s included & excluded
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Included Items */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-4 flex items-center">
            <IoMdCheckmark className="mr-2 text-green-600" />
            Included in your expedition
          </h3>
          <ul className="space-y-3">
            {included?.split("\r\n").map(
              (item, index) =>
                item.trim() && (
                  <li key={index} className="flex items-start">
                    <IoMdCheckmark className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item.trim()}</span>
                  </li>
                )
            )}
          </ul>
        </div>

        {/* Excluded Items */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Excluded
          </h3>
          <ul className="space-y-3">
            {excluded?.split("\r\n").map(
              (item, index) =>
                item.trim() && (
                  <li key={index} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-red-600 mt-1 mr-2 flex-shrink-0 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{item.trim()}</span>
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
