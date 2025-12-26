import { getDestinationWeCover } from "@/api/about/about";
import DataError from "@/components/shared/DataError";
import Image from "next/image";

interface Destination {
  id: number;
  title: string;
  image: string;
  description: string;
}

const extractData = async (response: Response): Promise<unknown> => {
  try {
    const data = await response.json();
    const responseObj = data as Record<string, unknown>;

    if (!responseObj.status) return null;

    if (responseObj.data && Array.isArray(responseObj.data)) {
      return responseObj.data;
    }
    if (responseObj.data && typeof responseObj.data === "object") {
      return responseObj.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return responseObj.data || data;
  } catch (error) {
    console.error("Error extracting data:", error);
    return null;
  }
};

const DestinationsSection = async () => {
  let destinationsData: Destination[] = [];
  let error: string | null = null;

  try {
    const response = await getDestinationWeCover();

    // Process destinations data
    const destinationsResult = await extractData(response);
    if (destinationsResult && Array.isArray(destinationsResult)) {
      destinationsData = destinationsResult as Destination[];
    } else {
      error = "Failed to fetch destinations data";
    }
  } catch (err) {
    error = "An error occurred while fetching destinations data";
    console.error(err);
  }

  // Show error state if no data is available
  if (error || destinationsData.length === 0) {
    return <DataError />;
  }

  return (
    <div className="bg-white py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-start mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Destinations We Cover
          </h2>
          <p className="text-gray-800 text-lg">
            Nature-rich travel across continents, always guided by purpose.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinationsData.map((destination) => (
            <div key={destination.id} className="cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-4 h-64">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-full object-cover"
                  width={500}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                />
              </div>

              {/* Title and Description */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-black">
                  {destination.title}
                </h3>
                {destination.description && (
                  <p className="text-gray-600 mt-2 text-sm">
                    {destination.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationsSection;
