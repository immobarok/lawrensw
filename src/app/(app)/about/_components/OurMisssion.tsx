import { getOurMission } from "@/api/about/about";
import DataError from "@/components/shared/DataError";
import MissionImage from "./MissionImage";

interface MissionData {
  id: number;
  header: string;
  title: string;
  description: string;
  image_1: string;
  image_2: string;
  alt_tag1?: string;
  alt_tag2?: string;
}

const extractData = async (response: Response): Promise<unknown> => {
  try {
    const data = await response.json();
    const responseObj = data as Record<string, unknown>;

    if (!responseObj || responseObj.success === false) return null;

    if (
      responseObj.data &&
      (responseObj.data as Record<string, unknown>).data &&
      Array.isArray((responseObj.data as Record<string, unknown>).data)
    ) {
      return (responseObj.data as Record<string, unknown>).data;
    }

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

const OurMissionSection = async () => {
  let missionData: MissionData | null = null;
  let error: string | null = null;

  try {
    const response = await getOurMission();
    console.log("Mission API Response:", response);

    const missionResult = await extractData(response);

    if (missionResult) {
      if (Array.isArray(missionResult) && missionResult.length > 0) {
        missionData = missionResult[0] as MissionData;
      } else if (
        typeof missionResult === "object" &&
        missionResult &&
        (missionResult as Record<string, unknown>).description
      ) {
        missionData = missionResult as MissionData;
      } else {
        error = "Invalid mission data structure";
      }
    } else {
      error = "No mission data available";
    }
  } catch (err) {
    error = "An error occurred while fetching mission data";
    console.error("Mission data fetch error:", err);
  }

  // Safe description splitting function
  const splitDescription = (
    description: string | undefined | null
  ): string[] => {
    if (!description) return [];
    return description
      .split(".  ")
      .filter((paragraph) => paragraph.trim() !== "");
  };

  // Fallback mission data
  const fallbackMission: MissionData = {
    id: 1,
    header: "Our Mission",
    title:
      "Discover the world's natural wonders through unforgettable experiences",
    description:
      "At AdventureTrips, we believe in creating meaningful connections between travelers and the natural world. Our mission is to provide exceptional eco-friendly tours that inspire conservation awareness while delivering unforgettable adventures. We are committed to sustainable tourism practices that protect the environments we visit and support local communities.",
    image_1: "/api/placeholder/320/320",
    image_2: "/api/placeholder/288/288",
  };

  const displayData = missionData || fallbackMission;
  const descriptionParagraphs = splitDescription(displayData.description);

  if (error) {
    return <DataError />;
  }

  return (
    <div className="bg-gradient-to-b from-white to-dark py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center my-10 -mt-3">
      <div className="container mx-auto pb-28">
        <div className="text-start mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {displayData.header || "Our Mission"}
          </h2>
          <p className="text-gray-800 text-lg">
            {displayData.title ||
              "Discover the world's natural wonders through unforgettable experiences"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          {/* Left Content - Description */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6 text-gray-800">
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph.trim()}.
                  </p>
                ))
              ) : (
                <>
                  <p className="text-lg leading-relaxed">
                    At AdventureTrips, we believe in creating meaningful
                    connections between travelers and the natural world.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Our mission is to provide exceptional eco-friendly tours
                    that inspire conservation awareness while delivering
                    unforgettable adventures.
                  </p>
                  <p className="text-lg leading-relaxed">
                    We are committed to sustainable tourism practices that
                    protect the environments we visit and support local
                    communities.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="relative flex justify-center mt-0 md:-mt-10">
            <div className="relative z-10">
              <div className="w-80 h-80 rounded-lg overflow-hidden shadow-none">
                <MissionImage
                  src={displayData.image_1}
                  alt={displayData.alt_tag1 || "Mission 1"}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  fallbackSrc="/api/placeholder/320/320"
                />
              </div>
            </div>
            <div className="absolute top-32 right-10 z-20">
              <div className="w-80 h-80 rounded-lg overflow-hidden shadow-none">
                <MissionImage
                  src={displayData.image_2}
                  alt={displayData.alt_tag2 || "Mission 2"}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  fallbackSrc="/api/placeholder/288/288"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMissionSection;
