import Image from "next/image";
import { getShipHero, ShipHero } from "@/api/ships/ships";


const ShipHeroSection = async () => {
  let heroData: ShipHero | null = null;
  let error: string | null = null;

  try {
    const response = await getShipHero();
    console.log("Ship Hero API Response:", response);
    if (response && response.data && response.data.length > 0) {
      heroData = response.data[0];
      console.log("Ship Hero Data Selected:", heroData);
    } else {
      console.log("No ship hero data received from API");
    }
  } catch (err) {
    error = "Unable to load hero section data. Please try again later.";
    console.error("Ship Hero API Error:", err);
  }

  const fallbackData: ShipHero = {
    id: 1,
    header: "Nature trip – explore finnish wilderness",
    title:
      "Browse the fleet that takes you to the world's most remote corners in comfort.",
    image: "/shipBanner.png",
    alt_tag: "Ship Banner",
  };

  const displayData = heroData || fallbackData;
  console.log("Final Ship Display Data:", displayData);

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
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[80px] md:h-[100px] lg:h-[120px] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default ShipHeroSection;
