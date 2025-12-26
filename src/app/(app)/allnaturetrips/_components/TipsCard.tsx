// components/TipCard.tsx
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { assets } from "../../../../../public/assets/assets";

interface Expedition {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string | StaticImageData;
  description: string;
  duration: string;
  ship: string;
  price: string;
  cta: string;
  ctaLink: string;
}

interface TipCardProps {
  trip: Expedition;
}

const TipCard = ({ trip }: TipCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col">
      {/* Image */}
      <Image
        src={trip?.image}
        alt={trip?.title}
        width={800}
        height={400}
        className="w-full h-56 object-cover rounded-2xl"
      />

      {/* Content */}
      <div className="pt-8 flex flex-col flex-1">
        {/* Category & Date */}
        <div className="flex justify-between items-center gap-2 mb-3 flex-nowrap">
          <span className=" py-1 text-secondary text-xs font-medium rounded-full">
            {trip.category}
          </span>
          <p className="px-3 py-1 bg-secondary-light/30 text-gray-800 text-xs rounded-full text-center w-24">
            {trip.date}
          </p>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {trip.description.replace(/<[^>]*>/g, "")}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
          <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <Image
                src={assets.Clock}
                width={16}
                height={16}
                alt="clk_icon"
                style={{ height: "auto", width: "16px" }}
              />
              <span>Duration</span>
            </div>
            <span className="block font-medium text-gray-900">
              {trip.duration}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <Image
                src={assets.shipIcon}
                width={16}
                height={16}
                alt="clk_icon"
              />
              <span>Ship</span>
            </div>
            <span className="block font-medium text-gray-900">{trip.ship}</span>
          </div>
          <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <Image
                src={assets.priceTag}
                width={16}
                height={16}
                alt="clk_icon"
              />
              <span>Price starting from</span>
            </div>
            <span className="block font-medium text-gray-900">
              {trip.price}
            </span>
          </div>
        </div>

        {/* CTA Button (always bottom) */}
        <Link
          href={trip.ctaLink}
          className="block text-center w-full py-2.5 bg-secondary text-white text-sm font-medium rounded-lg transition-colors mt-auto"
        >
          {trip.cta}
        </Link>
      </div>
    </div>
  );
};

export default TipCard;
