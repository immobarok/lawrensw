import Link from "next/link";
import SectionTitle from "../../../components/ui/SectionTitle";
import TourCard from "./TourCard";
import { getAllHomeTour, getHomeTourHeaderAndTitle } from "@/api/home/home";
import Button from "@/components/ui/Button";

interface TripData {
  id: number;
  name: string;
  subtitle: string;
  highlights: string;
  description: string;
  departure_date: string;
  return_date: string;
  trip_code: string;
  availability: string;
  feature_image: string;
  starting_city: string;
  finishing_city: string;
  starting_point: string;
  finishing_point: string;
  duration: number;
  includes: string;
  excludes: string;
  supplier: string | null;
}

interface TourData {
  id: number;
  header: string;
  title: string;
  image: string;
  duration: string;
  ship: string;
  price: string;
  alt_tag: string;
  trip_id: number;
  trip: TripData;
}

interface HeaderTitleData {
  id: number;
  header: string;
  title: string;
}

// Helper function to extract data from API responses
const extractData = async (response: Response): Promise<unknown> => {
  try {
    const data = await response.json();

    if (!data || typeof data !== "object") return null;

    // Handle doubly nested data
    if ("data" in data) {
      const responseData = data as { data?: unknown };
      if (
        responseData.data &&
        typeof responseData.data === "object" &&
        "data" in responseData.data &&
        responseData.data.data
      ) {
        return (responseData.data as { data: unknown }).data;
      }
      if (Array.isArray(responseData.data)) {
        return responseData.data;
      }
    }

    // Check different possible response structures
    if ("data" in data && Array.isArray((data as { data: unknown }).data)) {
      return (data as { data: unknown }).data;
    }
    if (
      (data as { data?: unknown }).data &&
      typeof (data as { data?: unknown }).data === "object" &&
      !Array.isArray((data as { data?: unknown }).data)
    ) {
      return (data as { data: unknown }).data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return typeof data === "object" && data !== null && "data" in data
      ? (data as { data: unknown }).data
      : data;
  } catch (error) {
    console.error("Error extracting data:", error);
    return null;
  }
};

const PopularTour = async () => {
  let tours: TourData[] = [];
  let headerTitle: HeaderTitleData | null = null;
  let error: string | null = null;

  try {
    // Fetch tours and header data in parallel
    const [toursResponse, headerResponse] = await Promise.allSettled([
      getAllHomeTour(),
      getHomeTourHeaderAndTitle(),
    ]);

    // Process tours data
    if (toursResponse.status === "fulfilled") {
      const toursResult = await extractData(toursResponse.value);
      if (toursResult && Array.isArray(toursResult)) {
        tours = toursResult as TourData[];
      } else {
        console.warn(
          "Unexpected tours response structure:",
          toursResponse.value
        );
        error = "Could not load tours.";
      }
    } else {
      console.error("Failed to fetch tours:", toursResponse.reason);
      error = "Failed to fetch tours.";
    }

    // Process header data
    if (headerResponse.status === "fulfilled") {
      const headerResult = await extractData(headerResponse.value);
      if (
        headerResult &&
        typeof headerResult === "object" &&
        !Array.isArray(headerResult)
      ) {
        headerTitle = headerResult as HeaderTitleData;
      } else if (Array.isArray(headerResult) && headerResult.length > 0) {
        headerTitle = headerResult[0] as HeaderTitleData;
      } else {
        console.warn(
          "Unexpected header response structure:",
          headerResponse.value
        );
        // No error set, will use fallback.
      }
    } else {
      console.error("Failed to fetch header:", headerResponse.reason);
      // No error set, will use fallback.
    }
  } catch (err) {
    error = "An error occurred while fetching data";
    console.error("Error fetching data:", err);
  }

  const transformTourData = (tour: TourData) => ({
    id: tour.id,
    category: tour.trip?.name || "Nature Trip",
    title: tour.header,
    description: tour.title,
    stats: [
      {
        icon: "FaClock" as const,
        label: "Duration",
        value: tour.duration,
      },
      {
        icon: "IoBoatOutline" as const,
        label: "Ship",
        value: tour.ship,
      },
      {
        icon: "GiPriceTag" as const,
        label: "Price starting from",
        value: `$${parseFloat(tour.price).toLocaleString()}`,
      },
    ],
    ctaText: "View expedition cruise",
    imageSrc: tour.image,
    imageAlt: `${tour.header} tour image`,
    tripId: tour.trip_id,
    availability: tour.trip?.availability || "Available",
  });

  const displayHeader = headerTitle || {
    id: 0,
    header: "Popular Nature Tours",
    title:
      'Hand-picked adventures in the "world\'s" most awe-inspiring ecosystems.',
  };

  if (error && tours.length === 0) {
    return (
      <section className="py-12 container mx-auto px-4">
        <SectionTitle
          title={displayHeader.header}
          description={displayHeader.title}
        />
        <div className="mt-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 container mx-auto px-4">
      <SectionTitle
        title={displayHeader.header}
        description={displayHeader.title}
      />

      {tours.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">No tours available at the moment.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 space-y-10">
          {tours.map((tour) => (
            <TourCard key={tour.id} {...transformTourData(tour)} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center">
        <Link
          href="/cruises"
          className="bg-secondary mt-6 text-lg font-semibold py-3.5 text-white px-14 rounded-lg"
        >
          View all our cruises
        </Link>
      </div>
    </section>
  );
};

export default PopularTour;
