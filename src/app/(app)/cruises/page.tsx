import TripHero from "./_components/TripHero";
import TripListContent from "./_components/TripListContent";
import type { TripFiltersState } from "./_components/types";
import { getAllTripsWithPagination } from "@/api/trip/AllTrips";
import type { TripsFilters } from "@/api/trip/AllTrips";

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

  const [allTrips, initialData] = await Promise.all([
    fetchAllTrips(),
    getAllTripsWithPagination(requestFilters),
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
      {/* <div className="my-16">
        <SeoTitle />
      </div> */}
    </div>
  );
};

export default TripsList;
