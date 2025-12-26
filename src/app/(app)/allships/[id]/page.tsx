import HeroDetailsSection from "./components/HeroDetailsSection";
import { getShipById, Ship } from "@/api/ships/ships";
import { notFound } from "next/navigation";
import CruiseDetails from "./components/CruiseDetails";

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: PageProps) => {
  let shipData: Ship | null = null;
  let error: string | null = null;

  try {
    const shipId = parseInt(params.id);
    if (isNaN(shipId)) {
      notFound();
    }

    shipData = await getShipById(shipId);
    console.log("Ship Details Data:", shipData);
  } catch (err) {
    error = "Unable to load ship details. Please try again later.";
    console.error("Ship Details API Error:", err);
    notFound();
  }

  if (!shipData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-shrink-0">
        <HeroDetailsSection ship={shipData} />
      </div>

      {/* Main Content with proper spacing */}
      <div className="flex-grow">
        <div className="container mx-auto">
          <CruiseDetails ship={shipData} />
        </div>
      </div>

      {/* Bottom spacing to prevent footer overlap */}
      <div className="flex-shrink-0 h-10"></div>
    </div>
  );
};
export default page;
