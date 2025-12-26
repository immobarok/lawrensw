import TipsHero from "./_components/TipsHero";
import SeoTitle from "@/components/shared/SeoTitle";
import { getAllTrips } from "@/api/trip/trips";
import { Trip } from "@/app/types/trip";
import Filters from "./_components/Filters";
import { Suspense } from "react";
import Loader from "@/components/shared/Loader";
import AllTipsClientWrapper from "./_components/AllTipsClientWrapper";
import { getAllNatureTripsPageMetaData } from "@/api/pagemeta/pagemeta";

export async function generateMetadata() {
  const meta = await getAllNatureTripsPageMetaData();
  return {
    title: meta.title,
    description: meta.description,
  };
}

const MIN = 3500;
const MAX = 40000;
const STEP = 100;
const itemsPerPage = 9;

interface SearchParams {
  destinations?: string;
  departure_date?: string;
  min_duration?: string;
  max_duration?: string;
  ship?: string;
  shipSize?: string;
  min_price?: string;
  max_price?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function PageLoading() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Loader message="Loading trips..." />
    </div>
  );
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  // Parse search parameters with defaults
  const page = parseInt(params.page || "1");
  const minPrice = parseInt(params.min_price || MIN.toString());
  const maxPrice = parseInt(params.max_price || MAX.toString());
  const destination = params.destinations || "";
  const startDate = params.departure_date || "";
  const minDuration = params.min_duration || "";
  const maxDuration = params.max_duration || "";
  const ship = params.ship || "";
  const shipSize = params.shipSize || "";

  // Build filters object according to API structure
  const filters: Record<string, unknown> = {
    page,
    limit: itemsPerPage,
  };

  if (destination) filters.destinations = destination;
  // Remove start date from API filter - will be handled on frontend
  // if (startDate) filters.departure_date = startDate;

  // Handle duration filters
  if (minDuration) filters.min_duration = parseInt(minDuration);
  if (maxDuration) filters.max_duration = parseInt(maxDuration);

  if (ship) filters.ship_name = ship;

  // Fetch trips data
  const result = await getAllTrips(filters);
  console.log("Trip Console", result);
  const trips: Trip[] = result.trips;
  const totalPages = result.totalPages;
  const totalItems = result.totalItems;

  // Convert API duration params back to UI format for display
  const getUiDuration = () => {
    if (minDuration === "1" && maxDuration === "3") return "1-3 days";
    if (minDuration === "4" && maxDuration === "7") return "4-7 days";
    if (minDuration === "8" && maxDuration === "14") return "8-14 days";
    if (minDuration === "15" && !maxDuration) return "15+ days";
    return "";
  };

  const uiDuration = getUiDuration();

  return (
    <div>
      <TipsHero />
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative -translate-y-12 sm:-translate-y-16 md:-translate-y-20 z-10">
        <div className="bg-blue rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Find your perfect expedition
          </h2>

          <Filters
            destination={destination}
            startDate={startDate}
            duration={uiDuration}
            ship={ship}
            shipSize={shipSize}
            minPrice={minPrice}
            maxPrice={maxPrice}
            MIN={MIN}
            MAX={MAX}
            STEP={STEP}
          />
        </div>
      </div>

      <Suspense fallback={<PageLoading />}>
        <AllTipsClientWrapper
          trips={trips}
          loading={false}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          minPrice={minPrice}
          maxPrice={maxPrice}
          MIN={MIN}
          MAX={MAX}
          startDate={startDate}
        />
      </Suspense>
      <SeoTitle />
    </div>
  );
};

export default Page;
