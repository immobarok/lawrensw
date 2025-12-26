"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AllTips from "./AllTips";
import { Trip } from "@/app/types/trip";
import { useState, useEffect, useMemo } from "react";

interface AllTipsClientWrapperProps {
  trips: Trip[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  minPrice: number;
  maxPrice: number;
  MIN: number;
  MAX: number;
  startDate: string;
}

const AllTipsClientWrapper = ({
  trips,
  loading,
  currentPage,
  totalPages,
  totalItems,
  minPrice,
  maxPrice,
  MIN,
  MAX,
  startDate,
}: AllTipsClientWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // Filter trips based on price range and start date
  const filteredTrips = useMemo(() => {
    let filtered = trips;

    // Filter by start date - show trips on or after the selected date
    if (startDate) {
      const selectedDate = new Date(startDate);
      filtered = filtered.filter((trip) => {
        if (trip.departure_date) {
          const departureDate = new Date(trip.departure_date);
          return departureDate >= selectedDate;
        }
        // If no departure date, exclude from results
        return false;
      });
    }

    // Filter by price range - only if not at default range
    if (minPrice !== MIN || maxPrice !== MAX) {
      filtered = filtered.filter((trip) => {
        // Get the lowest price for this trip
        if (trip.cabins_twos && trip.cabins_twos.length > 0) {
          const prices = trip.cabins_twos
            .map((cabin) => parseFloat(cabin.price))
            .filter((price) => !isNaN(price));

          if (prices.length > 0) {
            const lowestPrice = Math.min(...prices);
            return lowestPrice >= minPrice && lowestPrice <= maxPrice;
          }
        }
        // If no valid price found, exclude from filtered results
        return false;
      });
    }

    return filtered;
  }, [trips, minPrice, maxPrice, MIN, MAX, startDate]);

  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
    }
  }, [trips, currentPage]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    setIsNavigating(true);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", page.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  // Calculate pagination for filtered results
  const itemsPerPage = 9;
  const filteredTotalItems = filteredTrips.length;
  const filteredTotalPages = Math.ceil(filteredTotalItems / itemsPerPage);

  // Get trips for current page from filtered results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFilteredTrips = filteredTrips.slice(startIndex, endIndex);

  return (
    <AllTips
      trips={paginatedFilteredTrips}
      loading={loading || isNavigating}
      currentPage={currentPage}
      totalPages={filteredTotalPages}
      totalItems={filteredTotalItems}
      onPageChange={handlePageChange}
    />
  );
};

export default AllTipsClientWrapper;
