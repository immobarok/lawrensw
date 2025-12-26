// app/booking/_components/BookingForm.tsx (Client Component)
"use client";

import StepsForm from "./StepsForm";
import { Suspense } from "react";
import Loader from "@/components/shared/Loader";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function BookingFormWrapper() {
  const searchParams = useSearchParams();
  const tripId = searchParams?.get("tripId");
  const cabinId = searchParams?.get("cabinId");
  const name = decodeURIComponent(searchParams?.get("name") || "");
  const image = decodeURIComponent(searchParams?.get("image") || "");

  return (
    <>
      {/* Banner with dynamic image and name */}
      <div className="relative bg-cover bg-center h-96 md:h-[450px] lg:h-[500px] xl:h-[647px] flex flex-col items-start justify-end text-white text-start overflow-hidden">
        <Image
          src={image || "/export.png"}
          alt={name || "Nature Trip Banner"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/export.png";
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto lg:pb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-20 md:mb-32">
            {name || "Nature Trip – Explore Finnish Wilderness"}
          </h1>
        </div>
      </div>
      <div className="relative z-20 -mt-16 md:-mt-24 lg:-mt-32 container mx-auto mb-16">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-black">
          <StepsForm
            tripId={tripId ? parseInt(tripId) : undefined}
            cabinId={cabinId ? parseInt(cabinId) : undefined}
          />
        </div>
      </div>
    </>
  );
}

const BookingForm = () => {
  return (
    <Suspense fallback={<Loader message="Loading booking form..." />}>
      <BookingFormWrapper />
    </Suspense>
  );
};

export default BookingForm;