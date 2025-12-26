import AllTipsClientWrapper from "./_components/AllTipsClientWrapper";
import TipsHero from "./_components/TipsHero";
import { getTripListPageTwo } from "@/api/trip/trips";
import { Trip } from "@/app/types/trip";
import Filters from "./_components/Filters";
import SeoTitle from "@/components/shared/SeoTitle";
import Head from "next/head";



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
  min_price?: string;
  max_price?: string;
  page?: string;
  shipSize?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const minPrice = parseInt(params.min_price || MIN.toString());
  const maxPrice = parseInt(params.max_price || MAX.toString());
  const destination = params.destinations || "";
  const startDate = params.departure_date || "";
  const minDuration = params.min_duration || "";
  const maxDuration = params.max_duration || "";
  const ship = params.ship || "";
  const shipSize = params.shipSize || "";
  const filters: Record<string, unknown> = {
    page,
    limit: itemsPerPage,
    min_price: minPrice,
    max_price: maxPrice,
  };

  if (destination) filters.destinations = destination;
  if (startDate) filters.departure_date = startDate;

  // Handle duration filters
  if (minDuration) filters.min_duration = parseInt(minDuration);
  if (maxDuration) filters.max_duration = parseInt(maxDuration);

  if (ship) filters.ship = ship;

  // Fetch trips data
  const result = await getTripListPageTwo(filters);

  const trips: Trip[] = result.trips;
  /*   const allDestinations = trips.flatMap((trip) => trip.destinations || []);

  // Extract all destination names
  const allDestinationNames = allDestinations.map((dest) => dest.name);

  // Get unique destination names
  const uniqueDestinationNames = [...new Set(allDestinationNames)];

  // Log results
  console.log("All Destinations:", allDestinations);
  console.log("All Destination Names:", allDestinationNames);
  console.log("Unique Destination Names:", uniqueDestinationNames); */
  const totalPages = result.totalPages;
  const totalItems = result.totalItems;

  const getUiDuration = () => {
    if (minDuration === "1" && maxDuration === "3") return "1-3 days";
    if (minDuration === "4" && maxDuration === "7") return "4-7 days";
    if (minDuration === "8" && maxDuration === "14") return "8-14 days";
    if (minDuration === "15" && !maxDuration) return "15+ days";
    return "";
  };

  const uiDuration = getUiDuration();

  return (
    <>
      <Head>
        <title>Your Filtered Trips Page Title</title>
      </Head>
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

        <AllTipsClientWrapper
          trips={trips}
          loading={false}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
        />
        <SeoTitle />
      </div>
    </>
  );
};

export default Page;
