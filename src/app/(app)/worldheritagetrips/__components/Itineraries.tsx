"use client";

import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { IoMap } from "react-icons/io5";

// Import or define the types
interface ItineraryItem {
  id: number;
  trip_id: number;
  day: string;
  label: string;
  body: string;
}

interface LocationItem {
  id: number;
  trip_id: number;
  name: string;
}

interface ExpeditionData {
  name: string;
  itineraries?: ItineraryItem[];
  locations?: LocationItem[];
  // Add other fields as needed
}

interface ExpeditionDataProps {
  expeditionData: ExpeditionData;
}

const Itineraries: React.FC<ExpeditionDataProps> = ({ expeditionData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {expeditionData.itineraries && expeditionData.itineraries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Day-by-day itinerary
          </h2>

          {/* FAQ List */}
          <div className="space-y-4">
            {expeditionData.itineraries.map((itinerary, index) => {
              // Find locations that match this day's label
              const dayLocations = expeditionData.locations?.filter(
                (location) =>
                  itinerary.label
                    .toLowerCase()
                    .includes(location.name.toLowerCase()) ||
                  location.name
                    .toLowerCase()
                    .includes(itinerary.label.toLowerCase())
              );

              return (
                <div
                  key={itinerary.id}
                  className="cursor-pointer bg-white rounded-lg px-6 py-4 border border-gray-200"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  {/* Question (Day Title) */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start justify-between w-full">
                      {/* Left side (day + label) */}
                      <div className="flex flex-col gap-2.5">
                        {/* Day + Label row wise */}
                        <div className="flex items-center gap-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                            {itinerary.day} :
                          </h3>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 ml-1">
                            {itinerary.label}
                          </h3>
                        </div>

                        {/* Location below */}
                        {dayLocations && dayLocations.length > 0 && (
                          <div className="flex items-center gap-2">
                            <IoMap className="text-gray" />
                            <span className="text-sm text-gray-600">
                              {dayLocations.map((loc) => loc.name).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {openIndex === index ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.707 9.62124L21.2928 18.207L22.707 16.7928L14.1212 8.20703C14.1084 8.1942 14.0956 8.18138 14.0828 8.16857C13.783 7.86864 13.4916 7.57716 13.2189 7.36911C12.9115 7.13458 12.5136 6.91414 11.9999 6.91414C11.4863 6.91414 11.0883 7.13458 10.7809 7.36911C10.5082 7.57716 10.2169 7.86863 9.91707 8.16855C9.90426 8.18137 9.89144 8.19419 9.8786 8.20703L1.29282 16.7928L2.70703 18.207L11.2928 9.62124C11.6461 9.26792 11.8415 9.07556 11.9941 8.95916C11.9961 8.95764 11.998 8.95616 11.9999 8.95471C12.0018 8.95616 12.0038 8.95764 12.0058 8.95916C12.1583 9.07556 12.3537 9.26792 12.707 9.62124Z"
                          fill="#0E0E0E"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.293 15.3788L2.70718 6.79297L1.29297 8.20718L9.87876 16.793C9.89159 16.8058 9.9044 16.8186 9.9172 16.8314C10.217 17.1314 10.5084 17.4228 10.7811 17.6309C11.0885 17.8654 11.4864 18.0859 12.0001 18.0859C12.5137 18.0859 12.9117 17.8654 13.2191 17.6309C13.4918 17.4228 13.7831 17.1314 14.0829 16.8314C14.0957 16.8186 14.1086 16.8058 14.1214 16.793L22.7072 8.20718L21.293 6.79297L12.7072 15.3788C12.3539 15.7321 12.1585 15.9244 12.0059 16.0408C12.0039 16.0424 12.002 16.0438 12.0001 16.0453C11.9982 16.0438 11.9962 16.0424 11.9942 16.0408C11.8417 15.9244 11.6463 15.7321 11.293 15.3788Z"
                          fill="#0E0E0E"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Answer (Day Body/Content) */}
                  <div
                    className={`overflow-hidden text-sm text-gray-700 transition-all duration-300 ease-in-out ${
                      openIndex === index
                        ? "opacity-100 max-h-96 pt-4 mt-2"
                        : "opacity-0 max-h-0 pt-0 mt-0"
                    } border-t border-gray-200`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <div className="flex items-start gap-2">
                        <IoMdCheckmark className="text-blue text-lg mt-0.5 flex-shrink-0" />
                        <div className="text-sm leading-relaxed">
                          {itinerary.body}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Itineraries;
