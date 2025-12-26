import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  gethomeExperienceHeader,
  gethomeExperienceImageSection,
} from "@/api/home/home";

interface ImageData {
  id: number;
  name: string;
  image: string;
  alt_tag: string;
}

interface HeaderData {
  id: number;
  header: string;
  title: string;
}

const extractData = async (response: Response): Promise<unknown> => {
  try {
    const data = await response.json();
    console.log("Raw response data:", data);

    if (!data || typeof data !== "object") return null;

    const responseObj = data as Record<string, unknown>;

    // Check if it's your API format: {status: true, data: [...]}
    if (
      "status" in responseObj &&
      responseObj.status === true &&
      "data" in responseObj
    ) {
      console.log("Extracting from status/data format:", responseObj.data);
      return responseObj.data;
    }

    // Fallback: check for nested data.data structure
    if (
      "data" in responseObj &&
      responseObj.data &&
      typeof responseObj.data === "object"
    ) {
      const nestedData = responseObj.data as Record<string, unknown>;
      if ("data" in nestedData) {
        console.log("Extracting from nested data.data:", nestedData.data);
        return nestedData.data;
      }
      console.log("Extracting from data:", responseObj.data);
      return responseObj.data;
    }

    // If it's already an array, return it
    if (Array.isArray(responseObj)) {
      console.log("Response is already an array:", responseObj);
      return responseObj;
    }

    console.log("No valid data structure found, returning null");
    return null;
  } catch (error) {
    console.error("Error extracting data:", error);
    return null;
  }
};

const MasonryGrid = async () => {
  let images: ImageData[] = [];
  let headerData: HeaderData | null = null;
  let error: string | null = null;

  try {
    const [headerResponse, imagesResponse] = await Promise.all([
      gethomeExperienceHeader(),
      gethomeExperienceImageSection(),
    ]);

    const headerResult = await extractData(headerResponse);
    //console.log("HD",headerResult);
    if (
      headerResult &&
      typeof headerResult === "object" &&
      !Array.isArray(headerResult)
    ) {
      headerData = headerResult as HeaderData;
    } else if (Array.isArray(headerResult) && headerResult.length > 0) {
      headerData = headerResult[0] as HeaderData;
    }

    // Process images data
    const imagesResult = await extractData(imagesResponse);
    //console.log("IMG",imagesResult);
    if (Array.isArray(imagesResult)) {
      images = imagesResult as ImageData[];
    }
  } catch (err) {
    error = "Unable to load gallery data. Please try again later.";
    console.error("API Error:", err);
  }

  const heightClasses = ["h-96", "h-48", "h-64", "h-80", "h-80", "h-64"];

  return (
    <Section>
      {headerData ? (
        <SectionTitle
          title={headerData.header}
          description={headerData.title}
        />
      ) : (
        <SectionTitle
          title="Experience the Polar Wonders Like Never Before"
          description="Discover breathtaking destinations, legendary wildlife, and once-in-a-lifetime moments — curated by polar travel experts."
        />
      )}

      {error && (
        <div className="container mx-auto px-4 mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">NO DATA FOUND !!</p>
            No data Found !!!
          </div>
        </div>
      )}

      <div className="container">
        <div className="px-4">
          {images.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {images.map((image, index) => (
                <div key={image.id} className="break-inside-avoid group">
                  <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
                    <div
                      className={heightClasses[index % heightClasses.length]}
                    >
                      <img
                        src={image.image}
                        alt={image.alt_tag}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !error && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="break-inside-avoid group">
                    <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
                      <div className="h-64 bg-gray-200 animate-pulse"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-bold text-lg">Loading...</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </Section>
  );
};

export default MasonryGrid;
