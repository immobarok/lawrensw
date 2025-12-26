import { getHeroInformation, getDynamicTourButton } from "@/api/home/home";
import TourButtons from "./TourButtons";

interface HeroData {
  id: number;
  header: string;
  title: string;
  image: string;
  experience: number;
  happy_travelers: number;
  number_of_destination: number;
}

interface TourButton {
  id: number;
  button_name: string;
  trip_url: string;
  trip_id: string;
}

const extractData = async (response: Response): Promise<unknown> => {
  try {
    const data = await response.json();

    if (!data || typeof data !== "object") return null;
    if ("data" in data) {
      const resData = (data as { data: unknown }).data;
      if (
        resData &&
        typeof resData === "object" &&
        "data" in resData &&
        (resData as { data: unknown }).data
      ) {
        return (resData as { data: unknown }).data;
      }
      if (Array.isArray(resData)) {
        return resData;
      }
      if (resData && typeof resData === "object" && !Array.isArray(resData)) {
        return resData;
      }
    }
    if (Array.isArray(data)) {
      return data;
    }
    return "data" in data ? (data as { data: unknown }).data || data : data;
  } catch (error) {
    console.error("Error extracting data:", error);
    return null;
  }
};

const Hero = async () => {
  let heroData: HeroData | null = null;
  let tourButtons: TourButton[] = [];
  let error: string | null = null;

  try {
    // Fetch hero data and tour buttons in parallel
    const [heroResponse, tourButtonsResponse] = await Promise.all([
      getHeroInformation(),
      getDynamicTourButton(),
    ]);

    // console.log("Original Hero API Response:", heroResponse);
    // console.log("Original Tour Buttons API Response:", tourButtonsResponse);

    // Process hero data
    const heroResult = await extractData(heroResponse);
    if (heroResult && Array.isArray(heroResult) && heroResult.length > 0) {
      heroData = heroResult[0] as HeroData;
    }

    // Process tour buttons
    const tourButtonsResult = await extractData(tourButtonsResponse);
    if (tourButtonsResult && Array.isArray(tourButtonsResult)) {
      tourButtons = tourButtonsResult as TourButton[];
    }
  } catch (err) {
    error = "An error occurred while fetching data";
    console.error(err);
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k+`;
    }
    return `${num}+`;
  };

  if (error || !heroData) {
    return (
      <div className="bg-[url('/hero.jpg')] bg-black/30 bg-blend-overlay bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-white text-center overflow-hidden">
        <div className="container mx-auto">
          <h1 className="text-6xl md:text-[100px] leading-[100px] sm:leading-[140px] md:leading-[180px] lg:leading-[220px] mb-6 mx-auto font-quloon mt-28 md:mt-10 lg:mt-8">
            Discover our polar destinations.
          </h1>
          <p className="text-gray-800 font-medium text-lg mb-8">
            {error || "No hero data available at the moment."}
          </p>
          <div className="flex flex-row items-center justify-center gap-6 md:gap-10 mb-12 font-jakarta">
            <TourButtons buttons={tourButtons} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-black/30 bg-blend-overlay bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-white text-center overflow-hidden"
      style={{ backgroundImage: `url(${heroData.image || "/hero.jpg"})` }}
    >
      <div className="container mx-auto">
        <h1 className="text-6xl md:text-[100px] leading-[100px] sm:leading-[140px] md:leading-[180px] lg:leading-[220px] mb-6 mx-auto font-quloon mt-28 md:mt-10 lg:mt-8">
          {heroData.header}
        </h1>
        <p className="text-[20px] text-[#C4CDD5] mb-8 max-w-5xl mx-auto">
          {heroData.title}
        </p>
        <div className="flex flex-row items-center justify-center gap-6 md:gap-10 mb-12 font-jakarta">
          {/* Use the client component here */}
          <TourButtons buttons={tourButtons} />
        </div>
        <div className="flex flex-row items-center justify-between max-w-4xl mx-auto px-4 md:px-0">
          <div className="pb-4 sm:pb-0">
            <span className="mb-2 text-2xl lg:text-[40px] font-semibold">
              {formatNumber(heroData.number_of_destination)}
            </span>
            <p className="text-sm sm:text-xl md:text-[20px] font-medium">
              Cruises
            </p>
          </div>
          <div className="pb-4 sm:pb-0">
            <span className="mb-2 text-2xl lg:text-[40px] font-semibold">
              {formatNumber(heroData.happy_travelers)}
            </span>
            <p className="text-sm sm:text-xl md:text-[20px] font-medium">
              Happy Travelers
            </p>
          </div>
          <div className="pb-4 sm:pb-0">
            <span className="mb-2 text-2xl lg:text-[40px] font-semibold">
              {formatNumber(heroData.experience)}
            </span>
            <p className="text-sm sm:text-xl md:text-[20px] font-medium">
              Years of Experiences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
