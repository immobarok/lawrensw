"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import TripCard from "./TripCard";
import type { PaginatedTrips, Trip, TripsFilters } from "@/api/trip/AllTrips";
import { getAllTripsWithPagination } from "@/api/trip/AllTrips";
import type { TripFiltersState } from "./types";
import Filters from "./Filters";
import Loader from "@/components/shared/Loader";
import { useTranslatedText } from "@/hook/useTranslation";

type PriceBounds = {
  min: number;
  max: number;
  step: number;
};

type TripListContentProps = {
  allTrips: Trip[];
  initialData: PaginatedTrips;
  initialFilters: TripFiltersState;
  itemsPerPage: number;
  priceBounds: PriceBounds;
};

type TripExtras = {
  cabins?: { amount?: string | number }[];
  cabins_twos?: { price?: string | number }[];
  ship?: {
    name?: string;
    capacity?: number | string;
    passengers?: number | string;
    size?: string;
  };
  ship_capacity?: number | string;
  ship_size?: string;
  destinations?: { name?: string }[];
  duration?: number;
};

// Pre-compiled regex for better performance
const NUMERIC_CLEAN_REGEX = /[^0-9.]/g;

const DURATION_RANGES: Record<string, { min: number; max: number | null }> = {
  "1-3 days": { min: 1, max: 3 },
  "4-7 days": { min: 4, max: 7 },
  "8-14 days": { min: 8, max: 14 },
  "15+ days": { min: 15, max: null },
};

const FALLBACK_DESTINATIONS = [
  "Antarctica",
  "Antarctic Peninsula",
  "Australia",
  "Falkland Island",
  "Falkland Islands",
  "Greenland",
  "Japan",
  "New Zealand",
  "Norway",
  "Patagonia",
  "South Georgia",
  "South Orkney Islands",
  "South Pacific",
  "Subantarctic Islands",
  "Svalbard",
];

const FALLBACK_SHIPS = [
  "Heritage Adventurer",
  "Heritage Explorer",
  "m/v Hondius",
  "m/v Ortelius",
  "m/v Plancius",
  "s/v Rembrandt van Rijn",
];

const SHIP_SIZE_OPTIONS = [
  "Small (1-50 guests)",
  "Medium (51-100 guests)",
  "Large (100+ guests)",
];

const parseNumber = (value: string | null, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toDurationLabel = (
  minDuration: string | null,
  maxDuration: string | null
): string => {
  if (minDuration === "1" && maxDuration === "3") return "1-3 days";
  if (minDuration === "4" && maxDuration === "7") return "4-7 days";
  if (minDuration === "8" && maxDuration === "14") return "8-14 days";
  if (minDuration === "15" && (!maxDuration || maxDuration === ""))
    return "15+ days";
  return "";
};

const getTripDestinations = (trip: Trip): string[] => {
  const destinations: string[] = [];
  const enriched = trip as Trip & TripExtras;

  if (Array.isArray(trip.destinations_twos)) {
    for (const destination of trip.destinations_twos) {
      if (destination?.name) destinations.push(destination.name);
    }
  }

  if (Array.isArray(enriched.destinations)) {
    for (const destination of enriched.destinations) {
      if (destination?.name) destinations.push(destination.name);
    }
  }

  if (trip.region) {
    destinations.push(trip.region);
  }

  return destinations;
};

const extractNumericValue = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const cleaned = value.replace(NUMERIC_CLEAN_REGEX, "");
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const getLowestFromCollection = (
  collection: { amount?: string | number; price?: string | number }[],
  key: "amount" | "price"
): number | null => {
  let minValue: number | null = null;

  for (const item of collection) {
    const value = extractNumericValue(item?.[key]);
    if (value !== null && (minValue === null || value < minValue)) {
      minValue = value;
    }
  }

  return minValue;
};

const getTripLowestPrice = (trip: Trip): number | null => {
  const enriched = trip as Trip & TripExtras;

  const amount =
    Array.isArray(enriched.cabins) && enriched.cabins.length > 0
      ? getLowestFromCollection(enriched.cabins, "amount")
      : null;

  const price =
    Array.isArray(enriched.cabins_twos) && enriched.cabins_twos.length > 0
      ? getLowestFromCollection(enriched.cabins_twos, "price")
      : null;

  if (amount !== null && price !== null) {
    return Math.min(amount, price);
  }

  return amount ?? price;
};

const getShipName = (trip: Trip): string => {
  const enriched = trip as Trip & TripExtras;
  return enriched.ship?.name || trip.ship_name || "";
};

const buildSearchString = (filters: TripFiltersState, page: number): string => {
  const params = new URLSearchParams();

  if (filters.destination) params.set("destinations", filters.destination);
  if (filters.startDate) params.set("departure_date", filters.startDate);

  const durationRange = DURATION_RANGES[filters.duration];
  if (durationRange) {
    params.set("min_duration", durationRange.min.toString());
    if (durationRange.max !== null) {
      params.set("max_duration", durationRange.max.toString());
    }
  }

  if (filters.ship) params.set("ship", filters.ship);
  if (filters.shipSize) params.set("shipSize", filters.shipSize);

  params.set("min_price", filters.minPrice.toString());
  params.set("max_price", filters.maxPrice.toString());

  if (page > 1) params.set("page", page.toString());

  return params.toString();
};

const parseFiltersFromParams = (
  params: URLSearchParams,
  defaults: TripFiltersState,
  priceBounds: PriceBounds,
  fallbackPage: number
) => {
  const destination = params.get("destinations") ?? defaults.destination ?? "";
  const startDate = params.get("departure_date") ?? defaults.startDate ?? "";
  const ship = params.get("ship") ?? defaults.ship ?? "";
  const shipSize = params.get("shipSize") ?? defaults.shipSize ?? "";

  const minDuration = params.get("min_duration");
  const maxDuration = params.get("max_duration");
  const durationLabel = toDurationLabel(minDuration, maxDuration);

  const minPrice = parseNumber(
    params.get("min_price"),
    defaults.minPrice ?? priceBounds.min
  );
  const maxPrice = parseNumber(
    params.get("max_price"),
    defaults.maxPrice ?? priceBounds.max
  );

  const page = parseNumber(params.get("page"), fallbackPage);

  const filters: TripFiltersState = {
    destination,
    startDate,
    duration: durationLabel || defaults.duration || "",
    ship,
    shipSize,
    minPrice,
    maxPrice,
  };

  return { filters, page: Math.max(page, 1) };
};

const areFiltersEqual = (a: TripFiltersState, b: TripFiltersState): boolean =>
  a.destination === b.destination &&
  a.startDate === b.startDate &&
  a.duration === b.duration &&
  a.ship === b.ship &&
  a.shipSize === b.shipSize &&
  a.minPrice === b.minPrice &&
  a.maxPrice === b.maxPrice;

const createPaginationRange = (
  currentPage: number,
  totalPages: number
): Array<number | "ellipsis"> => {
  if (totalPages <= 1) return [1];

  const pages: Array<number | "ellipsis"> = [1];

  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
};

const buildRequestFilters = (
  filters: TripFiltersState,
  page: number,
  limit: number
): TripsFilters => {
  const durationRange = DURATION_RANGES[filters.duration];

  const requestFilters: TripsFilters = {
    page,
    limit,
    min_price: filters.minPrice,
    max_price: filters.maxPrice,
  };

  // Use proper backend parameter names
  if (filters.destination) {
    requestFilters.destinations = filters.destination;
  }

  if (filters.startDate) {
    requestFilters.departure_date = filters.startDate;
  }

  if (durationRange) {
    requestFilters.min_duration = durationRange.min;
    if (durationRange.max !== null) {
      requestFilters.max_duration = durationRange.max;
    }
  }

  // FIX: Only use ship_name, remove the duplicate 'ship' parameter
  if (filters.ship) {
    requestFilters.ship_name = filters.ship;
    // Remove this line: requestFilters.ship = filters.ship;
  }

  // FIX: Check if shipSize is actually supported by your backend
  // If not, remove this entirely
  if (filters.shipSize) {
    // Only include if your backend actually supports this parameter
    // requestFilters.shipSize = filters.shipSize;
  }

  return requestFilters;
};

const TripListContent = ({
  allTrips,
  initialData,
  initialFilters,
  itemsPerPage,
  priceBounds,
}: TripListContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialPageFallback = initialData.currentPage || 1;

  const [filters, setFilters] = useState<TripFiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPageFallback);
  const [tripData, setTripData] = useState<PaginatedTrips>(initialData);
  const [sortOption, setSortOption] = useState<string>("default");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingSearchRef = useRef<string | null>(null);
  const filtersRef = useRef<TripFiltersState>(initialFilters);
  const pageRef = useRef<number>(initialPageFallback);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const isFirstFetchRef = useRef(true);

  // Translation hooks
  const allExpeditionsLabel = useTranslatedText("All expedition cruises");
  const haveQuestionsText = useTranslatedText(
    "Can't decide which cruise is right for you? Contact us for a tailor-made solution."
  );
  const sortByLabel = useTranslatedText("Sort by:");
  const defaultSortText = useTranslatedText("Default order");
  const priceLowToHighText = useTranslatedText("Price Low To High");
  const priceHighToLowText = useTranslatedText("Price High To Low");
  const dateText = useTranslatedText("Date");
  const showingText = useTranslatedText("Showing");
  const toText = useTranslatedText("to");
  const ofText = useTranslatedText("of");
  const tripsText = useTranslatedText("trips");
  const filteringTripsText = useTranslatedText("Filtering trips...");
  const noTripsFoundText = useTranslatedText(
    "No trips found. Try adjusting your filters."
  );
  const previousText = useTranslatedText("Previous");
  const nextText = useTranslatedText("Next");
  const pageText = useTranslatedText("Page");
  const findPerfectExpeditionText = useTranslatedText(
    "Find your perfect expedition"
  );
  const failedToLoadTripsText = useTranslatedText(
    "Unable to load trips. Please try again."
  );

  const searchString = useMemo(
    () => searchParams?.toString() ?? "",
    [searchParams]
  );

  const parsedState = useMemo(() => {
    const params = new URLSearchParams(searchString);
    return parseFiltersFromParams(
      params,
      initialFilters,
      priceBounds,
      initialPageFallback
    );
  }, [searchString, initialFilters, priceBounds, initialPageFallback]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  // Handle click outside to close sort dropdown
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

  // Sync state with URL params (only when the search string actually changes)
  useEffect(() => {
    if (pendingSearchRef.current && pendingSearchRef.current === searchString) {
      pendingSearchRef.current = null;
      return;
    }

    if (!areFiltersEqual(parsedState.filters, filtersRef.current)) {
      setFilters(parsedState.filters);
    }

    if (pageRef.current !== parsedState.page) {
      setCurrentPage(parsedState.page);
    }
  }, [searchString, parsedState]);

  const destinationOptions = useMemo(() => {
    const unique = new Set<string>(FALLBACK_DESTINATIONS);
    allTrips.forEach((trip) => {
      getTripDestinations(trip).forEach((name) => {
        if (name) unique.add(name);
      });
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [allTrips]);

  const shipOptions = useMemo(() => {
    const unique = new Set<string>(FALLBACK_SHIPS);
    allTrips.forEach((trip) => {
      const shipName = getShipName(trip);
      if (shipName) {
        unique.add(shipName);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [allTrips]);

  useEffect(() => {
    if (isFirstFetchRef.current) {
      isFirstFetchRef.current = false;
      return;
    }

    const controller = new AbortController();

    const fetchTrips = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const requestFilters = buildRequestFilters(
          filters,
          currentPage,
          itemsPerPage
        );

        const data = await getAllTripsWithPagination(requestFilters, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setTripData(data);

        if (data.currentPage !== currentPage) {
          setCurrentPage(data.currentPage);
        }
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }

        console.error("Failed to fetch trips:", error);
        setErrorMessage(failedToLoadTripsText);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTrips();

    return () => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }, [filters, currentPage, itemsPerPage, failedToLoadTripsText]);

  const sortedTrips = useMemo(() => {
    const tripsToSort = [...tripData.trips];

    switch (sortOption) {
      case "price_low_high": {
        tripsToSort.sort((a, b) => {
          const priceA = getTripLowestPrice(a) ?? Number.POSITIVE_INFINITY;
          const priceB = getTripLowestPrice(b) ?? Number.POSITIVE_INFINITY;
          return priceA - priceB;
        });
        break;
      }

      case "price_high_low": {
        tripsToSort.sort((a, b) => {
          const priceA = getTripLowestPrice(a) ?? Number.NEGATIVE_INFINITY;
          const priceB = getTripLowestPrice(b) ?? Number.NEGATIVE_INFINITY;
          return priceB - priceA;
        });
        break;
      }

      case "date": {
        tripsToSort.sort((a, b) => {
          const dateA = a.departure_date
            ? new Date(a.departure_date).getTime()
            : Number.POSITIVE_INFINITY;
          const dateB = b.departure_date
            ? new Date(b.departure_date).getTime()
            : Number.POSITIVE_INFINITY;
          return dateA - dateB;
        });
        break;
      }

      default:
        break;
    }

    return tripsToSort;
  }, [tripData.trips, sortOption]);

  const paginatedTrips = sortedTrips;

  const totalItems =
    typeof tripData.totalItems === "number"
      ? tripData.totalItems
      : paginatedTrips.length;
  const totalPages = Math.max(tripData.totalPages || 0, 1);

  const from =
    typeof tripData.from === "number"
      ? tripData.from
      : paginatedTrips.length > 0
      ? (currentPage - 1) * itemsPerPage + 1
      : 0;

  const to =
    typeof tripData.to === "number"
      ? tripData.to
      : paginatedTrips.length > 0
      ? (currentPage - 1) * itemsPerPage + paginatedTrips.length
      : 0;

  const paginationRange = useMemo(
    () => createPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  // Optimized URL updates
  useEffect(() => {
    const nextSearch = buildSearchString(filters, currentPage);
    const currentSearch = searchString;

    if (nextSearch !== currentSearch) {
      pendingSearchRef.current = nextSearch;
      const target = nextSearch ? `${pathname}?${nextSearch}` : pathname;
      router.replace(target, { scroll: false });
    }
  }, [filters, currentPage, pathname, router, searchString]);

  const handleFiltersChange = useCallback(
    (changes: Partial<TripFiltersState>) => {
      setErrorMessage(null);
      setFilters((prev) => ({ ...prev, ...changes }));
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const bounded = Math.min(Math.max(nextPage, 1), totalPages);
      if (bounded !== currentPage) {
        setErrorMessage(null);
        setCurrentPage(bounded);
      }
    },
    [currentPage, totalPages]
  );

  const handleSortChange = useCallback((value: string) => {
    setErrorMessage(null);
    setSortOption(value);
    setIsSortDropdownOpen(false);
  }, []);

  const getSortDisplayText = (sortValue: string) => {
    const sortMap: Record<string, string> = {
      default: defaultSortText,
      price_low_high: priceLowToHighText,
      price_high_low: priceHighToLowText,
      date: dateText,
    };

    return sortMap[sortValue] || defaultSortText;
  };

  const showLoader = isLoading;
  const hasTrips = paginatedTrips.length > 0;
  const canShowSummary = !showLoader && !errorMessage;
  const canShowPagination = canShowSummary && totalItems > 0 && totalPages > 1;

  const SORT_OPTIONS = useMemo(
    () => [
      { value: "default", label: defaultSortText },
      { value: "price_low_high", label: priceLowToHighText },
      { value: "price_high_low", label: priceHighToLowText },
      { value: "date", label: dateText },
    ],
    [defaultSortText, priceLowToHighText, priceHighToLowText, dateText]
  );

  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative -translate-y-12 sm:-translate-y-16 md:-translate-y-20 z-10">
        <div className="bg-blue rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6">
            {findPerfectExpeditionText}
          </h2>

          <Filters
            filters={filters}
            priceBounds={priceBounds}
            destinationOptions={destinationOptions}
            shipOptions={shipOptions}
            shipSizeOptions={SHIP_SIZE_OPTIONS}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="text-gray-900 space-y-2.5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {allExpeditionsLabel}
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
                disabled={showLoader}
                className="text-gray-900 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {getSortDisplayText(sortOption)}
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
                    {SORT_OPTIONS.map((option) => (
                      <li key={option.value}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSortChange(option.value);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                            sortOption === option.value
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {canShowSummary && (
          <div className="flex justify-end mb-4">
            <span className="text-sm text-gray-600">
              {showingText} {from} {toText} {to} {ofText} {totalItems}{" "}
              {tripsText}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {showLoader ? (
            <div className="col-span-full">
              <Loader message={filteringTripsText} />
            </div>
          ) : errorMessage ? (
            <div className="col-span-full text-center text-red-600 py-12">
              {errorMessage}
            </div>
          ) : hasTrips ? (
            paginatedTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <div className="col-span-full text-center text-gray-600 py-12">
              {noTripsFoundText}
            </div>
          )}
        </div>

        {canShowPagination && (
          <div className="flex justify-center items-center space-x-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 rounded bg-blue text-white hover:bg-blue/90 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              {previousText}
            </button>

            {paginationRange.map((item, index) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-2">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePageChange(item)}
                  className={`px-3 py-2 rounded ${
                    currentPage === item
                      ? "bg-blue text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 rounded bg-blue hover:bg-blue/90 text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
            >
              {nextText}
            </button>
          </div>
        )}

        {canShowSummary && (
          <div className="block md:hidden text-center mt-4 text-sm text-gray-600">
            {pageText} {currentPage} {ofText} {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripListContent;
