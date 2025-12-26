"use client";

import Link from "next/link";
import { Trip } from "@/app/types/trip";
import TravelAdvisor from "@/components/shared/TravelAdvisor";
import { HiMiniTicket } from "react-icons/hi2";

interface BookingSidebarProps {
  expeditionData: Trip;
}

export default function BookingSidebar({
  expeditionData,
}: BookingSidebarProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Quick Facts */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Price & Booking
        </h3>
        <div className="bg-dark rounded-2xl p-4 mb-6">
          <div className="flex justify-between ">
            <p></p>
            <p className="text-blue bg-white rounded-xl px-4 py-2 font-bold flex gap-3 items-center flex-row-reverse">
              Price start from:
              <span>
                <HiMiniTicket />
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-6 justify-center items-center text-gray-900">
            <p className="font-bold text-2xl">
              ${expeditionData.cabins_twos?.[0]?.price || "NAN"}
            </p>
            <p>per person</p>
          </div>
        </div>

        <div className="bg-dark rounded-2xl p-4">
          <p className="flex gap-3 items-center text-blue font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12 13C12.5523 13 13 13.4477 13 14V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V14C11 13.4477 11.4477 13 12 13ZM12 7C12.5523 7 13 7.44772 13 8V11C13 11.5523 12.5523 12 12 12C11.4477 12 11 11.5523 11 11V8C11 7.44772 11.4477 7 12 7Z"
                fill="#013A8A"
              />
            </svg>
            Book this cruise before someone else takes your favorite cabin!
          </p>
        </div>
        {/* CTA Button */}
        <Link
          href={{
            pathname: `/allnaturetrips/${expeditionData.id}/book`,
            query: {
              name: encodeURIComponent(expeditionData.name || ""),
              image: encodeURIComponent(expeditionData.photos?.[0]?.url || ""),
              shipName: encodeURIComponent(expeditionData?.ship_name || ""),
              travelDate: encodeURIComponent(
                expeditionData.departure_date || ""
              ),
            },
          }}
          rel="noopener noreferrer"
          className="w-full mt-6 block text-center bg-gradient-to-b from-secondary via-[#EFB26A] to-[#EFB26A] hover:from-secondary/98 hover:to-secondary/60 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-sm"
        >
          Book Now
        </Link>
      </div>

      <div className="max-h-[600px]">
        <TravelAdvisor advisor={null} />
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Our expedition specialists are here to help you plan your adventure.
        </p>
        <Link
          href="/contact"
          className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
