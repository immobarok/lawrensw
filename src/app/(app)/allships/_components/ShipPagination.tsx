"use client";

import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

interface ShipPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const ShipPagination = ({
  currentPage,
  totalPages,
  totalItems,
}: ShipPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    const url = `${pathname}?page=${page}`;
    router.push(url);
  };

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-center gap-12 sm:gap-16 md:gap-24 my-12">
      <Button
        className={`px-12 py-2.5 rounded-md transition-colors ${
          isPrevDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue text-white hover:bg-blue-dark"
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isPrevDisabled}
      >
        Prev
      </Button>
      <span className="text-gray-900 hidden sm:block font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        className={`px-12 py-2.5 rounded-md transition-colors ${
          isNextDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue text-white hover:bg-blue-dark"
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isNextDisabled}
      >
        Next
      </Button>
    </div>
  );
};

export default ShipPagination;
