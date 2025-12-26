import { getOurStory } from "@/api/about/about";
import DataError from "@/components/shared/DataError";
import Image from "next/image";

interface IStory {
  id: number;
  header: string;
  title: string;
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

const OurStory = async () => {
  let storyData: IStory | null = null;
  let error: string | null = null;

  try {
    const response = await getOurStory();

    // Process story data
    const storyResult = await extractData(response);
    if (storyResult && Array.isArray(storyResult) && storyResult.length > 0) {
      storyData = storyResult[0] as IStory;
    } else if (storyResult && typeof storyResult === "object") {
      storyData = storyResult as IStory;
    } else {
      error = "Failed to fetch story data";
    }
  } catch (err) {
    error = "An error occurred while fetching story data";
    console.error(err);
  }

  // Show error state if no data is available
  if (error) {
    return <DataError />;
  }

  if (!storyData) {
    return (
      <div className="bg-white py-16 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Our Story
          </h2>
          <p className="mt-4 text-gray-500">No story data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6F8] py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          <div className="flex flex-col justify-between order-2 lg:order-1 h-full">
            {/* -------------Our story --------------- */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900">
                {storyData.header || "Our Story"}
              </h2>
              <p className="text-gray-500 text-base md:text-lg mt-4">
                {storyData.title ||
                  "From a passion for wild places to a global nature travel brand."}
              </p>
            </div>
            {/* ---------------------------- */}

            {/* text content  */}
            <div className="text-gray-700">
              <p className="text-base md:text-lg leading-relaxed">
                {storyData.description ||
                  "Founded by nature enthusiasts and travel professionals, Polar Traveler was born from a deep love for remote destinations and wildlife conservation."}
              </p>

              {/* Additional content that might come from API in the future */}
              {storyData.description && storyData.description.length > 200 && (
                <>
                  <p className="text-base md:text-lg leading-relaxed mt-4">
                    We started with polar expeditions, and today we guide
                    travelers across the globe — from the Arctic to the Amazon —
                    always with a deep respect for nature.
                  </p>

                  <p className="text-base md:text-lg leading-relaxed mt-4">
                    With over 15 years of experience, we design each journey to
                    be not just a trip, but a life-changing experience.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-sm overflow-hidden shadow-lg order-1 lg:order-2">
            {storyData?.image ? (
              <Image
                src={storyData.image}
                alt={storyData?.header || "Story Image"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            ) : (
              <DataError title="Story Image not found!!" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
