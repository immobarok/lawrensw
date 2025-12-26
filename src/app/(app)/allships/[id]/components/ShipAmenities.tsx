interface Amenity {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  amenities?: string;
}

interface Ship {
  id: number;
  name: string;
  amenities: Amenity[];
}

interface ShipAmenitiesProps {
  ship: Ship;
}

const ShipAmenities = ({ ship }: ShipAmenitiesProps) => {
  if (!ship?.amenities || ship.amenities.length === 0) {
    return (
      <div className="w-full p-4 sm:p-6 relative z-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Ship amenities
        </h2>
        <p className="text-gray-500">No amenities information available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden relative z-0">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Ship amenities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {ship.amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs sm:text-sm font-semibold">
                      {amenity.icon || "✓"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                    {amenity.amenities || "N/A"}
                  </h3>
                  {amenity.description && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {amenity.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipAmenities;
