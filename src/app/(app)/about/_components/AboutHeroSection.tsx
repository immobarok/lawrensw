import Image from "next/image";
import { getAboutHeroSection, AboutHeroData } from "@/api/about/about";
import DataError from "@/components/shared/DataError";

const AboutHeroSection = async () => {
  let heroData: AboutHeroData | null = null;
  let error: string | null = null;

  try {
    const response = await getAboutHeroSection();
    if (response && response.length > 0) {
      heroData = response[0];
      console.log("Hero Data Selected:", heroData);
    } else {
      console.log("No hero data received from API");
    }
  } catch (err) {
    error = "Unable to load hero section data. Please try again later.";
    console.error("About Hero API Error:", err);
  }

  const fallbackData: AboutHeroData = {
    id: 1,
    header: "Explore Nature. Travel with Purpose.",
    title:
      "At Polar Traveler, we connect curious explorers with the world's most stunning and untouched natural wonders.",
    image: "/about.png",
    alt_tag: "About Hero",
  };

  const displayData = heroData || fallbackData;
  console.log("Final Display Data:", displayData);

  return (
    <div className="relative">
      <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[647px] flex flex-col items-start justify-center text-white text-start overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={displayData.image}
            alt={displayData.alt_tag}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-dark/20 bg-blend-overlay"></div>
        </div>
        <div className="relative z-10 container max-w-8xl mx-auto p-4 md:p-0 mt-20 md:mt-28">
          <div className="text-black">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.2] md:leading-[1.3]">
              {displayData.header.split(".").map((part, index, array) => (
                <span key={index}>
                  {part.trim()}
                  {index < array.length - 1 && "."}
                  {index === 0 && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-full md:max-w-3xl leading-relaxed">
              {displayData.title}
            </p>
          </div>
        </div>
        {error && <DataError message={error} />}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[80px] md:h-[100px] lg:h-[120px] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default AboutHeroSection;
