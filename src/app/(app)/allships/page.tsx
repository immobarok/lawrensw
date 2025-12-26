import ShipHero from "./_components/ShipHero";
import AllShips from "./_components/AllShips";
import { getShipsPageMetaData } from "@/api/pagemeta/pagemeta";

export async function generateMetadata() {
  const meta = await getShipsPageMetaData();
  return {
    title: meta.title,
    description: meta.description,
  };
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");

  return (
    <div>
      <ShipHero />
      <AllShips currentPage={currentPage} />
    </div>
  );
}
