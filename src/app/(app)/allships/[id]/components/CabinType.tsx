"use client";
import { useState } from "react";
import Image from "next/image";

interface Cabin {
  id: number;
  shipview_id: number;
  cabin_type: string;
  description: string;
  image: string;
}

interface Ship {
  id: number;
  name: string;
  cabins: Cabin[];
}

interface CabinTypeProps {
  ship: Ship;
}

const CabinType = ({ ship }: CabinTypeProps) => {
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(
    ship?.cabins?.[0] || null
  );

  if (!ship?.cabins || ship.cabins.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center text-gray-500">
        No cabin information available
      </div>
    );
  }

  const formatCabinType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const parseDescription = (description: string) => {
    if (description.includes("<ul>") && description.includes("<li>")) {
      const listItemRegex = /<li>(.*?)<\/li>/g;
      const items = [];
      let match;

      while ((match = listItemRegex.exec(description)) !== null) {
        items.push(match[1]);
      }

      return items;
    }

    return [description];
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Cabin Types
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Cabin Types */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
              Select cabin type
            </h3>
            {ship.cabins.map((cabin) => (
              <button
                key={cabin.id}
                onClick={() => setSelectedCabin(cabin)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedCabin?.id === cabin.id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                <div className="font-medium text-sm sm:text-base">
                  {formatCabinType(cabin.cabin_type)}
                </div>
              </button>
            ))}
          </div>

          {/* Middle Column - Cabin Image */}
          <div className="flex flex-col items-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
              Cabin view
            </h3>
            {selectedCabin && (
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={selectedCabin.image}
                  alt={`${formatCabinType(selectedCabin.cabin_type)} cabin`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
          </div>

          {/* Right Column - Cabin Description */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
              Description
            </h3>
            {selectedCabin && (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue text-white p-3 sm:p-4 rounded-lg">
                  <h4 className="text-lg sm:text-xl font-bold">
                    {formatCabinType(selectedCabin.cabin_type)}
                  </h4>
                </div>

                <div className="prose prose-sm max-w-none">
                  <div className="space-y-2">
                    {parseDescription(selectedCabin.description).map(
                      (item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue text-xs font-bold">
                                ✓
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-1">
                            {item}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-friendly stacked layout for smaller screens */}
        <div className="lg:hidden mt-6 sm:mt-8">
          {selectedCabin && (
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-primary text-sm sm:text-base">
                Currently viewing: {formatCabinType(selectedCabin.cabin_type)}
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabinType;
