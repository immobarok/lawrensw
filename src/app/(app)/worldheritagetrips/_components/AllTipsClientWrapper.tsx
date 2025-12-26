"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AllTips from "./AllTips";
import { Trip } from "@/app/types/trip";

interface AllTipsClientWrapperProps {
  trips: Trip[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const AllTipsClientWrapper = ({
  trips,
  currentPage,
  totalPages,
  totalItems,
}: AllTipsClientWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const filteredTrips = useMemo(() => {
    const startDateAfter = searchParams?.get("start_date_after");

    if (!startDateAfter) {
      return trips;
    }

    const filterDate = new Date(startDateAfter);
    if (isNaN(filterDate.getTime())) {
      return trips;
    }
    return trips.filter((trip) => {
      if (trip.departure_date) {
        const tripDepartureDate = new Date(trip.departure_date);
        return tripDepartureDate >= filterDate;
      }
      return true; 
    });
  }, [trips, searchParams]);

  return (
    <AllTips
      trips={filteredTrips}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
    />
  );
};

export default AllTipsClientWrapper;
