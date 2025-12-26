// import SeoTitle from "@/components/shared/SeoTitle";
import TripHero from "./_components/TripHero";
import TripListContent from "./_components/TripListContent";
import type { TripFiltersState } from "./_components/types";
import { getAllTripsWithPagination } from "@/api/trip/AllTrips";
import type { TripsFilters } from "@/api/trip/AllTrips";
import { getCruiseGreenlandSeo } from "@/api/seo/seoTitle";
// import type { SeoResponse } from "@/api/seo/seoTitle";
import type { Metadata } from "next";
import parse from "html-react-parser";

const MIN_PRICE = 3500;
const MAX_PRICE = 40000;
const PRICE_STEP = 100;
const ITEMS_PER_PAGE = 9;

type SearchParams = Record<string, string | string[] | undefined>;

const getParam = (params: SearchParams, key: string) => {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? "";
};

const parseNumberParam = (value: string, fallback: number) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOptionalNumber = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toUiDuration = (minDuration: string, maxDuration: string) => {
  if (minDuration === "1" && maxDuration === "3") return "1-3 days";
  if (minDuration === "4" && maxDuration === "7") return "4-7 days";
  if (minDuration === "8" && maxDuration === "14") return "8-14 days";
  if (minDuration === "15" && maxDuration === "") return "15+ days";
  return "";
};

const API_PAGE_SIZE = 100;

type TripsListPageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: TripsListPageProps): Promise<Metadata> {
  const params = (await Promise.resolve(searchParams)) ?? ({} as SearchParams);
  const lang = getParam(params, "lang") || "en";

  try {
    const seoData = await getCruiseGreenlandSeo(lang);
    const title = (seoData as any)?.data?.data?.title || "Cruise Greenland";
    const description =
      (seoData as any)?.data?.data?.description ||
      "Explore Greenland with our cruise packages.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Failed to fetch SEO data:", error);
    return {
      title: "Cruise Greenland",
      description: "Explore Greenland with our cruise packages.",
    };
  }
}

const fetchAllTrips = async () => {
  const firstPage = await getAllTripsWithPagination({
    page: 1,
    limit: API_PAGE_SIZE,
  });

  const trips = [...firstPage.trips];

  if (firstPage.totalPages <= 1) {
    return trips;
  }

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const pageResult = await getAllTripsWithPagination({
      page,
      limit: API_PAGE_SIZE,
    });

    trips.push(...pageResult.trips);
  }

  return trips;
};

const TripsList = async ({ searchParams }: TripsListPageProps) => {
  const params = (await Promise.resolve(searchParams)) ?? ({} as SearchParams);

  const lang = getParam(params, "lang") || "en";

  const pageParam = getParam(params, "page") || "1";
  const destination = getParam(params, "destinations");
  const startDate = getParam(params, "departure_date");
  const minDurationParam = getParam(params, "min_duration");
  const maxDurationParam = getParam(params, "max_duration");
  const ship = getParam(params, "ship");
  const shipSize = getParam(params, "shipSize");
  const minPriceParam = getParam(params, "min_price");
  const maxPriceParam = getParam(params, "max_price");

  const page = Math.max(parseNumberParam(pageParam, 1), 1);
  const minPrice = parseNumberParam(minPriceParam, MIN_PRICE);
  const maxPrice = parseNumberParam(maxPriceParam, MAX_PRICE);

  const uiDuration = toUiDuration(minDurationParam, maxDurationParam);

  const minDurationValue = parseOptionalNumber(minDurationParam);
  const maxDurationValue = parseOptionalNumber(maxDurationParam);

  const requestFilters: TripsFilters = {
    page,
    limit: ITEMS_PER_PAGE,
    min_price: minPrice,
    max_price: maxPrice,
  };

  if (destination) {
    requestFilters.destinations = destination;
  }

  if (startDate) {
    requestFilters.departure_date = startDate;
  }

  if (minDurationValue !== undefined) {
    requestFilters.min_duration = minDurationValue;
  }

  if (maxDurationValue !== undefined) {
    requestFilters.max_duration = maxDurationValue;
  }

  if (ship) {
    requestFilters.ship_name = ship;
    requestFilters.ship = ship;
  }

  if (shipSize) {
    requestFilters.shipSize = shipSize;
  }

  const [allTrips, initialData, seoData] = await Promise.all([
    fetchAllTrips(),
    getAllTripsWithPagination(requestFilters),
    getCruiseGreenlandSeo(lang),
  ]);

  const initialFilters: TripFiltersState = {
    destination,
    startDate,
    duration: uiDuration,
    ship,
    shipSize,
    minPrice,
    maxPrice,
  };

  return (
    <div className="pb-12">
      <TripHero />

      <TripListContent
        allTrips={allTrips}
        initialData={initialData}
        initialFilters={initialFilters}
        itemsPerPage={ITEMS_PER_PAGE}
        priceBounds={{ min: MIN_PRICE, max: MAX_PRICE, step: PRICE_STEP }}
      />

      {/* seo description show here  */}
      <div className="my-16 container px-4 mx-auto">
        <div className="text-gray-600 text-lg leading-relaxed container mx-auto text-start prose prose-lg max-w-none">
          {parse(
            (seoData as any)?.data?.data?.description ||
              "Explore Greenland with our cruise packages."
          )}
        </div>
      </div>
    </div>
  );
};

export default TripsList;
