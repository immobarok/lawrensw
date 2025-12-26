import React from "react";

const TripNote = () => {
  return (
    <div className="p-6 bg-white rounded-xl w-full shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Important Note
      </h2>
      <div className="flex items-start bg-red-50 rounded-md p-4">
        <div className="flex-shrink-0 mt-1 mr-3">
          <svg
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-9 4a1 1 0 102 0 1 1 0 00-2 0zm1-9a1 1 0 00-1 1v5a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-gray-700 text-sm">
          Itineraries serve as a guideline only. Routes may change due to ice,
          weather, or wildlife conditions. Landings depend on site availability,
          permits, and AECO rules. Official sailing plans and landing slots are
          set before the season, yet the expedition leader makes the final
          decisions. Flexibility remains essential on expedition cruises.
        </p>
      </div>
    </div>
  );
};

export default TripNote;
