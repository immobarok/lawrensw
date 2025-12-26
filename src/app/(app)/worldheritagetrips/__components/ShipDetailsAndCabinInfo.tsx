"use client";

import { formatPrice } from "@/app/lib/formatPrice";
import Image from "next/image";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

if (typeof window !== "undefined") {
  import("leaflet").then((L) => {
    // Type assertion to handle Leaflet's internal properties
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
      ._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  });
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface ShipSpec {
  id: number;
  ship_id: number;
  name: string;
  value: string;
}

interface ShipGalleryItem {
  id: number;
  ship_id: number;
  image: string;
}

interface CabinPrice {
  id: number;
  cabin_id: number;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface Cabin {
  id: number;
  trip_id: number;
  name: string;
  description: string;
  amount: string;
  currency: string;
  deck_level: string;
  image: string;
  inclusions: string;
  exclusions: string;
  availability: string;
  prices: CabinPrice[];
}

interface Ship {
  id: number;
  trip_id: number;
  name: string;
  description: string;
  feature_image: string;
  cabin_layout_image: string;
  last_known_long: string;
  last_known_lat: string;
  last_updated: string;
  specs: ShipSpec[];
  gallery: ShipGalleryItem[];
}

interface ExpeditionData {
  ship: Ship;
  cabins: Cabin[];
}

interface ShipDetailsAndCabinInfoProps {
  expeditionData: ExpeditionData;
}

const ShipDetailsAndCabinInfo = ({
  expeditionData,
}: ShipDetailsAndCabinInfoProps) => {
  const { ship, cabins } = expeditionData;
  const [selectedCabinIndex, setSelectedCabinIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure Leaflet CSS is loaded
    const timer = setTimeout(() => setMapLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderHtmlContent = (html: string) => {
    return { __html: html };
  };

  const selectedCabin = cabins[selectedCabinIndex];

  // Convert lat/long strings to numbers with better error handling
  const parseCoordinate = (coord: string): number => {
    if (!coord) return 0;
    const num = parseFloat(coord);
    return isNaN(num) ? 0 : num;
  };

  const latitude = parseCoordinate(ship.last_known_lat);
  const longitude = parseCoordinate(ship.last_known_long);

  // Check if coordinates are valid (not 0,0 which is in the ocean off Africa)
  const hasValidCoordinates = latitude !== 0 && longitude !== 0;

  // Default center near Kimberley region, Western Australia
  const defaultCenter: [number, number] = [-17.3, 123.6];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Ship details & cabin information
      </h2>

      {/* Ship Overview */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Ship overview
        </h3>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Ship Description */}
          <div className="w-full">
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={renderHtmlContent(ship.description)}
            />
          </div>
        </div>
      </div>

      {/* Cabin Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Cabin information & pricing
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Cabin Names */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Available cabins
            </h4>
            <div className="space-y-2">
              {cabins.map((cabin, index) => (
                <button
                  key={cabin.id}
                  onClick={() => setSelectedCabinIndex(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selectedCabinIndex === index
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{cabin.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column - Cabin Description & Image */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Cabin details
            </h4>
            {selectedCabin && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={selectedCabin.image}
                    alt={selectedCabin.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/400/300";
                    }}
                  />
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedCabin.description}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Deck level
                  </h5>
                  <p className="text-gray-700 text-sm">
                    {selectedCabin.deck_level}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Availability
                  </h5>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedCabin.availability === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedCabin.availability}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Pricing & Details */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Pricing & Options
            </h4>
            {selectedCabin && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-3">
                    Base Price
                  </h5>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedCabin.amount, selectedCabin.currency)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">per person</p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">
                    Currency Options
                  </h5>
                  <div className="space-y-2">
                    {selectedCabin.prices.map((price) => (
                      <div
                        key={price.id}
                        className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {price.currency}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatPrice(price.amount, price.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCabin.inclusions && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Inclusions
                    </h5>
                    <p className="text-sm text-gray-700">
                      {selectedCabin.inclusions}
                    </p>
                  </div>
                )}

                {selectedCabin.exclusions && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Exclusions
                    </h5>
                    <p className="text-sm text-gray-700">
                      {selectedCabin.exclusions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cabin Layout */}
      {ship.cabin_layout_image && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Cabin Layout
          </h3>
          <Image
            src={ship.cabin_layout_image}
            alt="Cabin Layout"
            width={800}
            height={400}
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/api/placeholder/800/400";
            }}
          />
        </div>
      )}

      {/* Current Location with Map */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Current location
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold text-gray-800 mb-4">
            Last known position
          </p>

          {/* Map Container */}
          <div className="h-64 w-full rounded-lg overflow-hidden mb-4 border border-gray-200">
            {isClient && mapLoaded ? (
              <MapContainer
                center={
                  hasValidCoordinates ? [latitude, longitude] : defaultCenter
                }
                zoom={hasValidCoordinates ? 8 : 5}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {hasValidCoordinates && (
                  <Marker position={[latitude, longitude]}>
                    <Popup>
                      <div className="text-center">
                        <strong>{ship.name}</strong>
                        <br />
                        Current Position
                        <br />
                        Last updated:{" "}
                        {new Date(ship.last_updated).toLocaleDateString()}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">
              Latitude:{" "}
              {hasValidCoordinates ? latitude.toFixed(6) : "Not available"}
            </p>
            <p className="text-gray-600">
              Longitude:{" "}
              {hasValidCoordinates ? longitude.toFixed(6) : "Not available"}
            </p>
            <p className="text-gray-600 text-sm">
              Last updated: {new Date(ship.last_updated).toLocaleDateString()}
            </p>
            {hasValidCoordinates && (
              <p className="text-sm text-gray-500 mt-2">
                Location: Kimberley region, Western Australia (Indian Ocean)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipDetailsAndCabinInfo;
