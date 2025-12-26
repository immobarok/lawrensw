import { getTripsDetailsTwo } from "@/api/trip/trips";
import { Trip } from "@/app/types/trip";

import FAQ from "@/components/layout/Faq/FAQ";
import ExpeditionDetailsClient from "../_components/ExpeditionDetailsClient";
import Review from "@/components/layout/Review/Review";

interface ExpeditionDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpeditionDetailsPage({
  params,
}: ExpeditionDetailsPageProps) {
  const resolvedParams = await params;
  const expeditionId = Number(resolvedParams.id);

  console.log("Fetching details for expedition ID:", expeditionId);
  try {
    const response = await getTripsDetailsTwo(expeditionId);
    console.log("Expedition details response:", response);
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch expedition data");
    }

    const responseData = response.data as unknown as { data: { trip: Trip } };
    const expeditionData = responseData.data.trip;

    return (
      <ExpeditionDetailsClient expeditionData={expeditionData}>
        <div className="bg-dark">
          <Review />
          <FAQ />
        </div>
      </ExpeditionDetailsClient>
    );
  } catch (error) {
    console.error("Error fetching expedition data:", error);
    throw new Error("Failed to load expedition details");
  }
}
