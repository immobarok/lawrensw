"use client";

import React from "react"
import Image from "next/image";
import { useState, useRef } from "react"; // Added useRef
import { IoArrowBack, IoArrowForward, IoClose } from "react-icons/io5";

interface ShipGalleryItem {
  id: number;
  ship_id: number;
  image: string;
}

interface ShipGalleryProps {
  gallery: ShipGalleryItem[];
}

const ShipGallery: React.FC<ShipGalleryProps> = ({ gallery }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.2; 
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      {gallery && gallery.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Ship gallery
          </h2>

          {/* Main Grid Container (6 images - 3x2) - Always visible */}
          <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-6">
            {gallery.slice(0, 6).map((galleryItem, index) => (
              <div
                key={galleryItem.id}
                className="relative aspect-square cursor-pointer group"
                onClick={() => {
                  setSelectedImageIndex(index);
                  setIsImageModalOpen(true);
                }}
              >
                <Image
                  src={galleryItem.image}
                  alt={`Ship gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 33vw, 16.666vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/api/placeholder/300/300";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Scrollable Section for remaining images */}
          {gallery.length > 6 && (
            <div className="relative">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                More photos ({gallery.length - 6})
              </h3>

              {/* Navigation Arrows */}
              <button
                onClick={() => scrollGallery("left")}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <IoArrowBack size={20} />
              </button>

              <button
                onClick={() => scrollGallery("right")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <IoArrowForward size={20} />
              </button>
              <div
                id="gallery-scroll-container"
                ref={scrollContainerRef} 
                className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {gallery.slice(6).map((galleryItem, index) => (
                  <div
                    key={galleryItem.id}
                    className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] snap-start cursor-pointer group"
                    onClick={() => {
                      setSelectedImageIndex(index + 6);
                      setIsImageModalOpen(true);
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={galleryItem.image}
                        alt={`Ship gallery image ${index + 7}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/300/300";
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Image Modal */}
      {isImageModalOpen && gallery && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-all z-10"
          >
            <IoClose size={32} />
          </button>

          <div className="relative max-w-full max-h-full w-full">
            <div className="relative aspect-video max-h-[80vh] w-full">
              <Image
                src={
                  gallery[selectedImageIndex]?.image ||
                  "/api/placeholder/800/600"
                }
                alt="Expanded view"
                fill
                className="object-contain"
                sizes="90vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/api/placeholder/800/600";
                }}
              />
            </div>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : gallery.length - 1
                    );
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all"
                >
                  <IoArrowBack size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev < gallery.length - 1 ? prev + 1 : 0
                    );
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all"
                >
                  <IoArrowForward size={20} />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipGallery;
