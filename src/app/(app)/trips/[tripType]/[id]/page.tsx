import { notFound } from "next/navigation";
import { getExpeditionsById, getTripsDetailsTwo } from "@/api/trip/trips";
import { Trip } from "@/app/types/trip";
import ExpeditionDetails from "../../../allnaturetrips/_components/ExpeditionDetails";
import ExpeditionDetailsClient from "../../../worldheritagetrips/_components/ExpeditionDetailsClient";
import FAQ from "@/components/layout/Faq/FAQ";
import Review from "@/components/layout/Review/Review";

interface PageParams {
  tripType: string;
  id: string;
}

async function fetchTripOneDetails(id: number): Promise<Trip> {
  const response = await getTripsDetailsTwo(id);

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to fetch trip one details");
  }

  const responseData = response.data as unknown;
  if (!responseData || typeof responseData !== "object") {
    throw new Error("Invalid trip one response structure");
  }

  const dataLayer = responseData as { data?: { trip?: Trip } };
  const trip = dataLayer.data?.trip;

  if (!trip) {
    throw new Error("Trip details missing in trip one response");
  }

  return trip;
}

async function fetchTripTwoDetails(id: number): Promise<Trip> {
  const response = await getExpeditionsById(id);

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Failed to fetch trip two details");
  }

  const responseData = response.data as unknown;
  if (
    !responseData ||
    typeof responseData !== "object" ||
    !("data" in responseData)
  ) {
    throw new Error("Invalid trip two response structure");
  }

  const nestedData = (responseData as { data: unknown }).data;
  if (
    !nestedData ||
    typeof nestedData !== "object" ||
    !("trip" in nestedData)
  ) {
    throw new Error("Trip data not found in trip two response");
  }

  const trip = (nestedData as { trip: Trip }).trip;

  if (!trip) {
    throw new Error("Trip details missing in trip two response");
  }

  return trip;
}

export default async function TripDetailsPage({
  params,
}: {
  params: PageParams;
}) {
  const { tripType, id } = params;
  const numericId = Number(id);

  if (!Number.isFinite(numericId)) {
    notFound();
  }

  try {
    if (tripType === "trip_one") {
      const tripData = await fetchTripOneDetails(numericId);

      return (
        <ExpeditionDetailsClient expeditionData={tripData}>
          <div className="bg-dark">
            <Review />
            <FAQ />
          </div>
        </ExpeditionDetailsClient>
      );
    }

    if (tripType === "trip_two") {
      const tripData = await fetchTripTwoDetails(numericId);

      return (
        <>
          <ExpeditionDetails expeditionData={tripData} />
          <div className="py-4 bg-dark">
            <Review />
            <FAQ />
          </div>
        </>
      );
    }

    console.warn(`Unsupported trip type received: ${tripType}`);
    notFound();
  } catch (error) {
    console.error(`Failed to load trip details for ${tripType}:${id}`, error);
    throw new Error("Failed to load trip details");
  }
}
