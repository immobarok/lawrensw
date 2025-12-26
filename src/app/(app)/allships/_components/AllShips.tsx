import { getAllShips, Ship } from "@/api/ships/ships";
import ShipCard from "./ShipCard";
import DataError from "@/components/shared/DataError";
import ShipPagination from "./ShipPagination";

interface AllShipsProps {
  currentPage: number;
}

const ITEMS_PER_PAGE = 6;

const AllShips = async ({ currentPage }: AllShipsProps) => {
  let ships: Ship[] = [];
  let error: string | null = null;

  try {
    const response = await getAllShips();
    ships = response.data || [];
  } catch (err) {
    error = "Failed to load ships";
    console.error("Ships fetch error:", err);
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <DataError
          title="Unable to Load Ships"
          message="We couldn't fetch the ships data. Please try again later."
        />
      </div>
    );
  }

  if (!ships || ships.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <DataError
          title="No Ships Available"
          message="There are currently no ships to display."
        />
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(ships.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedShips = ships.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our fleet</h2>
        <p className="text-lg text-gray-600">
          Explore our collection of expedition ships designed for polar
          adventures.
        </p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {paginatedShips.map((ship) => (
          <ShipCard key={ship.id} ship={ship} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <ShipPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={ships.length}
        />
      )}
    </div>
  );
};

export default AllShips;
