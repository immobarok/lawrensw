import Image from "next/image";
import Link from "next/link";
import { Ship } from "@/api/ships/ships";

interface ShipCardProps {
  ship: Ship;
}

const ShipCard = ({ ship }: ShipCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Ship Image */}
      <div className="relative h-64 w-full">
        {ship.image ? (
          <Image
            src={ship.image}
            alt={ship.name}
            fill
            className="object-cover hober:scale-105 hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Ship Details */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{ship.name}</h3>

        {/* Ship Stats - Only Capacity and Comfort Level */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-1">
              <Image
                src="/images/people.png"
                alt="Capacity"
                width={20}
                height={20}
                className="object-contain"
              />
              <p className="text-sm text-gray-500">Capacity</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{ship.capacity}</p>
            </div>
          </div>
          <div className="flex items-start flex-col gap-2">
            <div className="flex items-center gap-1">
              <Image
                src="/images/level.png"
                alt="Comfort Level"
                width={20}
                height={20}
                className="object-contain"
              />
              <p className="text-sm text-gray-500">Comfort Level</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 capitalize">
                {ship.comfort_level || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          href={`/allships/${ship.id}`}
          className="block w-full bg-blue text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-dark transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ShipCard;
