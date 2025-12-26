"use client";

import Image from "next/image";

interface RouteMapProps {
  mapUrl: string;
}

export default function RouteMap({ mapUrl }: RouteMapProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Expedition route
      </h2>
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={mapUrl}
          alt="Expedition Route Map"
          width={800}
          height={400}
          className="w-full h-full object-cover"
          sizes="(max-width: 600px) 100vw, 800px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/api/placeholder/800/400";
          }}
        />
      </div>
    </div>
  );
}
