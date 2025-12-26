import CabinType from "./CabinType";
import DeckPlan from "./DeckPlan";
import ShipAmenities from "./ShipAmenities";
import ShipInformation from "./ShipInformation";

interface Amenity {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

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
  amenities: Amenity[];
  cabins: Cabin[];
}

interface ShipInformationProps {
  ship: Ship;
}

const CruiseDetails = ({ ship }: ShipInformationProps) => {
  console.log("Ship details",ship);
  return (
    <div className="relative z-20 -mt-20 pb-20">
      <div className="container max-w-8xl mx-auto px-4 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Main Content - Responsive columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* CabinType Component */}
            <div className="bg-white border rounded-lg shadow-lg">
              <CabinType ship={ship} />
            </div>

            {/* ShipAmenities Component with gap */}
            <div className="bg-white border rounded-lg shadow-lg">
              <ShipAmenities ship={ship} />
            </div>
            {/* DeckPlan Component with gap */}
            <div className="bg-white border rounded-lg shadow-lg">
              <DeckPlan ship={ship} />
            </div>
          </div>

          {/* Sidebar - Independent container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg h-fit">
              <ShipInformation ship={ship} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CruiseDetails;
