"use client";

import { assets } from "../../../../../public/assets/assets";
import TipCard from "./TipsCard";
import { StaticImageData } from "next/image";
import Button from "./../../../../components/ui/Button";
import { Trip } from "@/app/types/trip";
import Loader from "@/components/shared/Loader";
import DataError from "@/components/shared/DataError";
import { useState, useEffect } from "react";

interface Expedition {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string | StaticImageData;
  description: string;
  duration: string;
  ship: string;
  price: string;
  cta: string;
  ctaLink: string;
}

interface AllTipsProps {
  trips?: Trip[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

const AllTips = ({
  trips,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: AllTipsProps) => {
  const [isPageLoading, setIsPageLoading] = useState(loading);
  const [displayedTrips, setDisplayedTrips] = useState<Trip[]>(trips || []);
  const [sortValue, setSortValue] = useState("");
  const [loadingType, setLoadingType] = useState<
    "pagination" | "filter" | "initial" | null
  >(null);

  useEffect(() => {
    setDisplayedTrips(trips || []);
    setIsPageLoading(loading);
    if (!loading) {
      setLoadingType(null);
    }
  }, [trips, loading]);

  const handlePageChange = (page: number) => {
    if (onPageChange && !isPageLoading) {
      setIsPageLoading(true);
      setLoadingType("pagination");
      onPageChange(page);
    }
  };

  const handleSortChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSortValue(value);

    if (
      value === "price_low_high" ||
      value === "price_high_low" ||
      value === "date"
    ) {
      setIsPageLoading(true);
      setLoadingType("filter");
      setTimeout(() => {
        const sortedTrips = [...displayedTrips];
        if (value === "price_low_high") {
          sortedTrips.sort((a, b) => {
            const getLowestPrice = (trip: any) => {
              if (trip.cabins_twos && trip.cabins_twos.length > 0) {
                const prices = trip.cabins_twos
                  .map((cabin: any) => parseFloat(cabin.price))
                  .filter((price: number) => !isNaN(price));
                return prices.length > 0 ? Math.min(...prices) : 0;
              }
              return 0;
            };
            const priceA = getLowestPrice(a);
            const priceB = getLowestPrice(b);
            return priceA - priceB;
          });
        } else if (value === "price_high_low") {
          sortedTrips.sort((a, b) => {
            const getLowestPrice = (trip: any) => {
              if (trip.cabins_twos && trip.cabins_twos.length > 0) {
                const prices = trip.cabins_twos
                  .map((cabin: any) => parseFloat(cabin.price))
                  .filter((price: number) => !isNaN(price));
                return prices.length > 0 ? Math.min(...prices) : 0;
              }
              return 0;
            };
            const priceA = getLowestPrice(a);
            const priceB = getLowestPrice(b);
            return priceB - priceA;
          });
        } else if (value === "date") {
          sortedTrips.sort((a, b) => {
            const dateA = new Date(a.departure_date || 0).getTime();
            const dateB = new Date(b.departure_date || 0).getTime();
            return dateA - dateB;
          });
        }
        setDisplayedTrips(sortedTrips);
        setIsPageLoading(false);
        setLoadingType(null);
      }, 1500);
    } else if (value === "") {
      setSortValue("");
      setDisplayedTrips(trips || []);
      setIsPageLoading(false);
      setLoadingType(null);
    }
  };

  const getLoadingMessage = () => {
    switch (loadingType) {
      case "pagination":
        return "Loading next page...";
      case "filter":
        return "Applying filters...";
      case "initial":
        return "Loading trips...";
      default:
        return "Loading trips...";
    }
  };

  const tipsData: Expedition[] = Array.isArray(displayedTrips)
    ? displayedTrips.map((trip) => ({
        id: trip.id,
        title: trip.name,
        category:
          trip.destinations_twos?.map((dest) => dest.name).join(", ") ||
          "Nature Trip",
        date: trip.departure_date
          ? `${new Date(trip.departure_date).toLocaleDateString()}`
          : "Date not available",
        image: trip.photos?.[0]?.url ? trip.photos[0].url : assets.NatureTrip,
        description: trip.summary || "No description available",
        duration: trip.days ? `${trip.days} Days` : "Duration not available",
        ship: trip.ship_name || "Ship information not available",
        price: (() => {
  console.log('Trip cabins:', trip.cabins_twos); // Add this for debugging
  
  if (trip.cabins_twos && trip.cabins_twos.length > 0) {
    const prices = trip.cabins_twos
      .map((cabin) => {
        console.log('Cabin price:', cabin.price, 'Type:', typeof cabin.price); 
        return parseFloat(cabin.price);
      })
      .filter((price) => !isNaN(price));
    
    console.log('Valid prices:', prices); // Debug filtered prices
    
    if (prices.length > 0) {
      const lowestPrice = Math.min(...prices);
      console.log('Lowest price:', lowestPrice); // Debug final price
      return `$ ${lowestPrice.toFixed(2)}`;
    }
  }
  return "Price not available";
})(),
        cta: "View expedition cruise",
        ctaLink: `allnaturetrips/${trip.id}?${new URLSearchParams({
          name:
            trip.name
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") || "trip",
          category:
            trip.destinations_twos?.[0]?.name
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") || "nature",
          duration: trip.days ? `${trip.days}-days` : "flexible",
          price: (() => {
            if (trip.cabins_twos && trip.cabins_twos.length > 0) {
              const prices = trip.cabins_twos
                .map((cabin) => parseFloat(cabin.price))
                .filter((price) => !isNaN(price));
              const lowestPrice = Math.min(...prices);
              return lowestPrice.toString();
            }
            return "contact-us";
          })(),
          ship:
            trip.ship_name
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") || "luxury-ship",
        }).toString()}`,
      }))
    : [];

  const hasTrips = tipsData.length > 0;
  const isPrevDisabled = currentPage <= 1 || isPageLoading;
  const isNextDisabled = currentPage >= totalPages || isPageLoading;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="text-gray-900 space-y-2.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            All expedition cruises
          </h1>
          <p className="text-lg text-gray-600">
            Can&apos;t decide which cruise is right for you? Contact us for a
            tailor-made solution.
          </p>
        </div>

        {/* Sort Dropdown */}
        {hasTrips && (
          <div className="flex items-center gap-3 self-start md:self-end">
            <label htmlFor="sort" className="text-gray-900 font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortValue}
              onChange={handleSortChange}
              disabled={isPageLoading}
              className="bg-white border border-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Default</option>
              <option value="price_low_high">Price Low To High</option>
              <option value="price_high_low">Price High To Low</option>
              <option value="date">Date</option>
            </select>
            {isPageLoading && loadingType === "filter" && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {!isPageLoading && !hasTrips && (
        <div className="text-center py-16">
          <div className="p-12">
            <DataError
              title="No Trips Found!!"
              message="There are currently no trips available. Please check back later or try different search criteria."
            />
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-secondary-dark transition-colors mt-4"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      {/* Cards Container */}
      <div className="relative min-h-[400px]">
        {/* Cards Grid */}
        {hasTrips && !isPageLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tipsData.map((trip) => (
              <TipCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        {/* Loader - Shows in card container area */}
        {isPageLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            <div className="col-span-full flex items-center justify-center">
              <Loader message={getLoadingMessage()} />
            </div>
          </div>
        )}

        {/* Pagination */}
        {hasTrips && totalPages > 1 && (
          <div className="flex items-center justify-center gap-12 sm:gap-16 md:gap-24 my-12">
            <Button
              className={`px-12 py-2.5 rounded-md transition-colors ${
                isPrevDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue text-white hover:bg-blue-dark"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isPrevDisabled}
            >
              Prev
            </Button>
            <span className="text-gray-900 hidden sm:block font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              className={`px-12 py-2.5 rounded-md transition-colors ${
                isNextDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue text-white hover:bg-blue-dark"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isNextDisabled}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTips;
