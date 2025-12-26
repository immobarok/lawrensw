import { getExpeditionsById } from "@/api/trip/trips";
import { Trip } from "@/app/types/trip";
import ExpeditionDetails from "../_components/ExpeditionDetails";
import Review from "@/components/layout/Review/Review";
import FAQ from "@/components/layout/Faq/FAQ";

interface ExpeditionDetailsPageProps {
  params: { id: string };
}

export default async function ExpeditionDetailsPage({
  params,
}: ExpeditionDetailsPageProps) {
  try {
    const resolvedParams = params;
    const expeditionId = Number(resolvedParams.id);
    const response = await getExpeditionsById(expeditionId);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch expedition data");
    }

    // Type-safe access to nested data
    const responseData = response.data as unknown;
    if (
      !responseData ||
      typeof responseData !== "object" ||
      !("data" in responseData)
    ) {
      throw new Error("Invalid response structure");
    }

    const nestedData = (responseData as { data: unknown }).data;
    if (
      !nestedData ||
      typeof nestedData !== "object" ||
      !("trip" in nestedData)
    ) {
      throw new Error("Trip data not found in response");
    }

    const expeditionData = (nestedData as { trip: Trip }).trip;

    return (
      <>
      <ExpeditionDetails expeditionData={expeditionData} />
      <div className="py-4 bg-dark">
      <Review/>
      
      <FAQ/>
      </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching expedition data:", error);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-red-600 mb-6 text-lg font-medium">
            {error instanceof Error
              ? error.message
              : "Expedition details not found!"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 text-sm w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
