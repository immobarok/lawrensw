"use client";

import { Trip } from "@/app/types/trip";
import TripHero from "../[id]/_components/TripHero";
import ExpeditionOverview from "./ExpeditionOverview";
import ItinerarySection from "./ItinerarySection";
import RouteMap from "./RouteMap";
import IncludedExcluded from "./IncludedExcluded";
import BookingSidebar from "./BookingSidebar";
import TripNote from "./TripNote";


interface ExpeditionDetailsProps {
  expeditionData: Trip;
}

export default function ExpeditionDetails({
  expeditionData,
}: ExpeditionDetailsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 overflow-x-hidden">
      <TripHero expeditionData={expeditionData} />

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 -mt-20 sm:-mt-30 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <ExpeditionOverview expeditionData={expeditionData} />

            {expeditionData.itineraries_twos &&
              expeditionData.itineraries_twos.length > 0 && (
                <ItinerarySection
                  itineraries={expeditionData.itineraries_twos.map(itinerary => ({
                    ...itinerary,
                    port: itinerary.port ?? "",
                  }))}
                />
              )}

            {expeditionData.map && <RouteMap mapUrl={expeditionData.map} />}

            <IncludedExcluded
              included={expeditionData.trip_included}
              excluded={expeditionData.trip_excluded}
            />
            <TripNote/>
          </div>

          <BookingSidebar expeditionData={expeditionData} />
        </div>
      </div>
    </div>
  );
}
