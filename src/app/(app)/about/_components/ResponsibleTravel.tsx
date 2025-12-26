import { getresponsibleTravelApi } from "@/api/about/about";
import DataError from "@/components/shared/DataError";
import Image from "next/image";

interface TravelItem {
  id: number;
  heading: string;
  description: string;
  image: string;
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

const ResponsibleTravel = async () => {
  let travelData: TravelItem[] = [];
  let error: string | null = null;

  try {
    const response = await getresponsibleTravelApi();

    // Process travel data
    const travelResult = await extractData(response);
    if (travelResult && Array.isArray(travelResult)) {
      travelData = travelResult as TravelItem[];
    } else {
      error = "Failed to fetch responsible travel data";
    }
  } catch (err) {
    error = "An error occurred while fetching responsible travel data";
    console.error(err);
  }

  return (
    <div className="bg-[#F4F6F8] py-16 px-4 sm:px-6 ">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Text */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900">
                Responsible Travel
              </h2>
              <p className="text-gray-500 text-base md:text-lg mt-4">
                We care for the planet — and every trip reflects that.
              </p>
            </div>

            <div className="text-gray-700 mt-6">
              <p className="text-base md:text-lg leading-relaxed">
                We are committed to sustainable tourism — partnering with local
                communities, offsetting emissions, and protecting endangered
                species through every trip we offer.
              </p>
            </div>
          </div>

          {/* Right Cards */}
          <div className="relative bg-white rounded-2xl">
            <div className="grid grid-cols-1 gap-3 p-5">
              {travelData.length > 0
                ? travelData.map((item) => (
                    <div
                      key={item.id}
                      className="flex-1 p-6 bg-dark rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.heading}
                            width={38}
                            height={38}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.heading}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                : // Fallback content if no data is available
                  !error &&
                  [1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex-1 p-6 bg-dark rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
                          <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Responsible Practice {item}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Description of responsible travel practice.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Error message (if any) */}
            {error && <DataError />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleTravel;
