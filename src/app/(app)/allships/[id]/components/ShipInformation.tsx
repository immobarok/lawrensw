interface Ship {
  id: number;
  name: string;
  crew_number: number;
  capacity: number;
  length: string;
  zodiac_boats: string;
  description?: string;
  build_year?: string;
  comfort_level?: string;
  max_guests?: number;
  price?: string;
  image?: string;
}

interface ShipInformationProps {
  ship: Ship;
}

const ShipInformation = ({ ship }: ShipInformationProps) => {
  return (
    <div className="px-4 sm:px-6 py-4 h-full">
      {" "}
      {/* Added h-full and responsive padding */}
      <h1 className="text-xl sm:text-2xl font-bold text-black">
        Ship information
      </h1>
      <div className="mt-4 space-y-2 sm:space-y-0">
        {" "}
        {/* Changed to space-y for mobile */}
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-semibold">Build year:</span> {ship.build_year}
          </p>
        </div>
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-semibold">Ship name:</span> {ship.name}
          </p>
        </div>
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-semibold">Crew number:</span>{" "}
            {ship.crew_number}
          </p>
        </div>
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-semibold">Max guest:</span> {ship.capacity}
          </p>
        </div>
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-semibold">Ship length:</span>
            <span> {ship.length}{" meters"}</span>
          </p>
        </div>
        <div className="pt-3">
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-semibold">Zodiac boats:</span>
            <span> {ship.zodiac_boats}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ShipInformation;
