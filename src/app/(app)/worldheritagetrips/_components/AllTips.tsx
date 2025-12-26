"use client";

import { assets } from "../../../../../public/assets/assets";
import TipCard from "./TipsCard";
import { StaticImageData } from "next/image";
import Button from "./../../../../components/ui/Button";
import { Trip } from "@/app/types/trip";
import Loader from "@/components/shared/Loader";
import DataError from "@/components/shared/DataError";
import { useState, useEffect, useRef } from "react";
import { useTranslatedText } from "@/hook/useTranslation";

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
  const [isLoading, setIsLoading] = useState(loading);
  const [localTrips, setLocalTrips] = useState<Trip[]>(trips || []);
  const [sortValue, setSortValue] = useState("");
  const [loadingType, setLoadingType] = useState<
    "pagination" | "filter" | "initial" | null
  >(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Translation hooks for sort dropdown
  const allTripsLabel = useTranslatedText("All expedition cruises");
  const sortByLabel = useTranslatedText("Sort by:");
  const defaultSortText = useTranslatedText("Default");
  const priceLowToHighText = useTranslatedText("Price Low To High");
  const priceHighToLowText = useTranslatedText("Price High To Low");
  const dateText = useTranslatedText("Date");
  const haveQuestionsText = useTranslatedText(
    "Can’t decide which cruise is right for you? Contact us for a tailor-made solution."
  );
  const noTripsFoundText = useTranslatedText("No Trips Found!!");
  const noTripsMessageText = useTranslatedText(
    "There are currently no trips available. Please check back later or try different search criteria."
  );
  const refreshPageText = useTranslatedText("Refresh Page");
  const prevText = useTranslatedText("Prev");
  const nextText = useTranslatedText("Next");
  const pageText = useTranslatedText("Page");
  const ofText = useTranslatedText("of");

  // Helper function to get translated sort display text
  const getSortDisplayText = (sortValue: string) => {
    const sortMap: Record<string, string> = {
      "": defaultSortText,
      price_low_high: priceLowToHighText,
      price_high_low: priceHighToLowText,
      date: dateText,
    };

    return sortMap[sortValue] || defaultSortText;
  };

  // Update local state when props change
  useEffect(() => {
    setLocalTrips(trips || []);
    setIsLoading(loading);
    if (!loading) {
      setLoadingType(null);
    }
  }, [trips, loading]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSortDropdownOpen &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortDropdownOpen]);

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setLoadingType("pagination");
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleSortChange = (value: string) => {
    console.log(`Sort option selected: ${value}`);
    setSortValue(value);
    setIsLoading(true);
    setLoadingType("filter");
    setIsSortDropdownOpen(false);

    setTimeout(() => {
      let sortedTrips = [...localTrips];
      if (value === "price_low_high") {
        console.log("Sorting by price low to high");
        sortedTrips.sort((a, b) => {
          const priceA = Number(a.cabins?.[0]?.amount) || 0;
          const priceB = Number(b.cabins?.[0]?.amount) || 0;
          return priceA - priceB;
        });
      } else if (value === "price_high_low") {
        console.log("Sorting by price high to low");
        sortedTrips.sort((a, b) => {
          const priceA = Number(a.cabins?.[0]?.amount) || 0;
          const priceB = Number(b.cabins?.[0]?.amount) || 0;
          return priceB - priceA;
        });
      } else if (value === "date") {
        console.log("Sorting by date");
        sortedTrips.sort((a, b) => {
          const dateA = new Date(a.departure_date).getTime();
          const dateB = new Date(b.departure_date).getTime();
          return dateA - dateB;
        });
      } else if (value === "") {
        console.log("Resetting to default sort");
        sortedTrips = trips || [];
      }
      setLocalTrips(sortedTrips);
      setIsLoading(false);
      setLoadingType(null);
    }, 500);
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

  const getSortLabel = () => {
    return getSortDisplayText(sortValue);
  };

  const tipsData: Expedition[] = Array.isArray(localTrips)
    ? localTrips.map((trip) => ({
        id: trip.id,
        title: trip.name,
        category: trip?.destinations?.[0]?.name || "Nature Trip",
        date: `${new Date(trip.departure_date).toLocaleDateString()}`,
        image: trip.feature_image ? trip.feature_image : assets.NatureTrip,
        description: trip.highlights || "No description available",
        duration: `${trip.duration} Days`,
        ship: trip.ship?.name || "Ship information not available",
        price: trip.cabins?.[0]?.amount
          ? `$ ${trip.cabins?.[0].amount}`
          : "Price not available",
        cta: "View expedition cruise",
        ctaLink: `/worldheritagetrips/${trip.id}?${new URLSearchParams({
          name:
            trip.name
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") || "trip",
          category:
            trip?.destinations?.[0]?.name
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") || "world-heritage",
          duration: `${trip.duration}-days`,
          price: trip.cabins?.[0]?.amount || "contact-us",
          ship:
            trip.ship?.name
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") || "luxury-ship",
        }).toString()}`,
      }))
    : [];

  const hasTrips = tipsData.length > 0;
  const isPrevDisabled = currentPage <= 1 || isLoading;
  const isNextDisabled = currentPage >= totalPages || isLoading;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="text-gray-900 space-y-2.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {allTripsLabel}
          </h1>
          <p className="text-lg text-gray-600">{haveQuestionsText}</p>
        </div>

        {/* Sort Dropdown */}
        <div
          className="flex items-center gap-3 self-start md:self-end"
          ref={sortDropdownRef}
        >
          <label className="text-gray-900 font-medium">{sortByLabel}</label>
          <div className="relative">
            <button
              id="sortDropdownButton"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              disabled={isLoading}
              className="text-gray-900 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {getSortLabel()}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Sort Dropdown menu */}
            {isSortDropdownOpen && (
              <div
                id="sortDropdown"
                className="z-50 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
              >
                <ul
                  className="py-2 text-sm text-gray-700"
                  aria-labelledby="sortDropdownButton"
                >
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Default sort selected");
                        handleSortChange("");
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        sortValue === "" ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      {defaultSortText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Price Low To High sort selected");
                        handleSortChange("price_low_high");
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        sortValue === "price_low_high"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {priceLowToHighText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Price High To Low sort selected");
                        handleSortChange("price_high_low");
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        sortValue === "price_high_low"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {priceHighToLowText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Date sort selected");
                        handleSortChange("date");
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        sortValue === "date" ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      {dateText}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && !hasTrips && (
        <div className="text-center py-16">
          <div className="p-12">
            <DataError title={noTripsFoundText} message={noTripsMessageText} />
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-secondary-dark transition-colors mt-4"
            >
              {refreshPageText}
            </button>
          </div>
        </div>
      )}
      {/* Cards Container */}
      <div className="relative min-h-[400px]">
        {/* Cards Grid */}
        {hasTrips && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tipsData.map((trip) => (
              <TipCard key={trip.id} trips={trip} />
            ))}
          </div>
        )}

        {/* Loader - Shows in card container area */}
        {isLoading && (
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
              {prevText}
            </Button>
            <span className="text-gray-900 hidden sm:block font-medium">
              {pageText} {currentPage} {ofText} {totalPages}
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
              {nextText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTips;
