import { getUniueFeatures } from "@/api/about/about";
import DataError from "@/components/shared/DataError";
import Image from "next/image";

interface FeatureItem {
  id: number;
  heading: string;
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

const WhatMakesUsDifferent = async () => {
  let featuresData: FeatureItem[] = [];
  let error: string | null = null;

  try {
    const response = await getUniueFeatures();

    // Process features data
    const featuresResult = await extractData(response);
    if (featuresResult && Array.isArray(featuresResult)) {
      featuresData = featuresResult as FeatureItem[];
    } else {
      error = "Failed to fetch unique features data";
    }
  } catch (err) {
    error = "An error occurred while fetching unique features data";
    // console.error(err);
  }

  return (
    <div className="py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="text-start mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            What Makes Us Different
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            We believe in travel that inspires and protects the natural world.
          </p>
        </div>

        {/* Error message (if any) */}
        {error && <DataError title="Data not found at this moment!!" />}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresData.length > 0
            ? featuresData.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-dark p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex flex-col items-start mb-4">
                    <div className="rounded-full flex items-center justify-center">
                      <Image
                        src={feature.image}
                        alt={feature.heading}
                        width={32}
                        height={32}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 space-y-2 mt-2.5">
                      {feature.heading}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))
            : // Show placeholder cards if no data is available
              !error &&
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-dark p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col items-start mb-4">
                    <div className="rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 space-y-2 mt-2.5">
                      Feature {item}
                    </h3>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    No description available at the moment.
                  </p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default WhatMakesUsDifferent;
