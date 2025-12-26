import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import { IoBoatOutline } from "react-icons/io5";

interface TourStats {
  icon: "FaClock" | "IoBoatOutline" | "GiPriceTag";
  label: string;
  value: string;
}

interface TourCardProps {
  category: string;
  title: string;
  description: string;
  stats: TourStats[];
  ctaText: string;
  imageSrc: string;
  imageAlt: string;
  tripId?: number;
  availability?: string;
}

const iconComponents = {
  FaClock: FaClock,
  IoBoatOutline: IoBoatOutline,
  GiPriceTag: GiPriceTag,
};

type IconKey = keyof typeof iconComponents;

const TourCard = ({
  category,
  title,
  description,
  stats,
  ctaText,
  imageSrc,
  imageAlt,
  tripId
}: TourCardProps) => {
  return (
    <div className="p-6 rounded-[16px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-between">
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-5 text-secondary">
              {category || "Category Not added"}
            </h3>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold mb-3 sm:mb-4 text-heading-dark">
              {title}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-gray">
              {description}
            </p>
          </div>
          <div className="flex flex-row justify-between gap-4 sm:gap-6 mt-4">
            {stats.map((stat, index) => {
              const IconComponent = iconComponents[stat.icon as IconKey];
              return (
                <div key={index}>
                  <p className="flex items-center gap-2 mb-2 text-sm sm:text-base text-gray">
                    {IconComponent && <IconComponent />} {stat.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-medium text-heading-dark">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {tripId ? (
            <Link
              href={`/trips/trip_one/${tripId}`}
              className="px-6 py-3 w-full text-center bg-blue text-white rounded-lg font-bold text-sm sm:text-base hover:bg-[#012a6b] transition-colors mt-6"
            >
              {ctaText}
            </Link>
          ) : (
            <button className="px-6 py-3 bg-blue text-white rounded-lg font-bold text-sm sm:text-base hover:bg-[#012a6b] transition-colors mt-6">
              {ctaText}
            </button>
          )}
        </div>

        {/* Image */}
        <div className=" order-first lg:order-last">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={640}
            height={426}
            className="object-cover w-full h-64 sm:h-80 lg:h-[426px] lg:w-[640px] rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default TourCard;
