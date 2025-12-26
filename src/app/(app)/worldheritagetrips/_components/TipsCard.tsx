// components/tripsCard.tsx
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
  duration: number | string;
  ship: string;
  price: string;
  cta: string;
  ctaLink: string;
}

interface tripsCardProps {
  trips: Expedition;
}

const tripsCard = ({ trips }: tripsCardProps) => {
  //console.log("trips", trips);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 p-5 ">
      {/* Image */}
      <Image
        src={typeof trips.image === "string" ? trips.image : trips.image}
        alt={trips.title}
        width={800}
        height={400}
        className="w-full h-56 object-cover rounded-2xl"
      />

      {/* Content */}
      <div className="pt-8">
        {/* Category & Date */}
        <div className="flex justify-between flex-wrap gap-2 mb-3">
          <span className=" py-1 text-secondary text-xs font-medium rounded-full">
            {trips.category}
          </span>
          <span className="px-3 py-1 bg-secondary-light/30 text-gray-800 text-xs rounded-full">
            {trips.date}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{trips.title}</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {trips.description.replace(/<[^>]*>/g, "")}
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
              {trips.duration}
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
            <span className="block font-medium text-gray-900">
              {trips.ship}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <Image
                src={assets.priceTag}
                width={16}
                height={16}
                alt="clk_icon"
              />
              <span>Price strating from</span>
            </div>
            <span className="block font-medium text-gray-900">
               {trips.price}
            </span>
          </div>
        </div>
        <Link
          href={trips.ctaLink}
          className="block text-center w-full py-2.5 bg-secondary text-white text-sm font-medium rounded-lg transition-colors"
        >
          {trips.cta}
        </Link>
      </div>
    </div>
  );
};

export default tripsCard;
