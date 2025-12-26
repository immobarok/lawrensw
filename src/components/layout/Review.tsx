"use client";

import Image from "next/image";
import { assets } from "../../../public/assets/assets";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useRef, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { getReviews, getRatingData } from "@/api/rating/rating";
import Loader from "../shared/Loader";

interface ReviewData {
  id: number;
  name: string;
  email: string | null;
  rating: string;
  comment: string | null;
  image: string;
}

interface RatingCalculation {
  average: number;
  count: number;
}

const Review = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [ratingData, setRatingData] = useState<RatingCalculation>({
    average: 0,
    count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedReviews, fetchedRatingData] = await Promise.all([
          getReviews(),
          getRatingData(),
        ]);

        setReviews(fetchedReviews);
        setRatingData(fetchedRatingData);
      } catch (err) {
        setError("Failed to fetch review data");
        console.error("Error fetching review data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (sliderRef.current) {
      const cardWidth = window.innerWidth < 640 ? window.innerWidth - 32 : 650;
      sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const cardWidth = window.innerWidth < 640 ? window.innerWidth - 32 : 650;
      sliderRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    return (
      <div className="flex mb-4 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={16}
            className={`sm:w-5 sm:h-5 ${
              star <= fullStars
                ? "text-yellow-400"
                : star === fullStars + 1 && hasHalfStar
                ? "text-yellow-200"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loader message="loading review..." />;
  }

  if (error) {
    return (
      <div className="text-black container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">NO DATA FOUND !!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-black container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
            Read Real Experiences From Our Travelers
          </h1>
          <p className="py-3 text-sm sm:text-base">
            From Arctic ice to tropical jungles – here&apos;s what our guests
            say about our European and global wildlife trips.
          </p>
        </div>
        <div className="flex shrink-0 items-end gap-3 sm:gap-5">
          <button
            onClick={handlePrev}
            className="bg-dark p-2 sm:p-3.5 rounded-full shadow text-gray-400 hover:text-gray-500 transition"
          >
            <MdArrowBackIos size={18} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="bg-white p-2 sm:p-3.5 rounded-full shadow text-gray-800 hover:text-gray-600 transition"
          >
            <MdArrowForwardIos size={18} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mt-5">
        {/* Fixed Experience Overview */}
        <div className="w-full lg:w-80 max-w-full min-w-[300px] lg:max-w-[320px] px-4 sm:px-6 py-4 bg-white rounded-2xl shadow">
          <p className="text-xl sm:text-2xl font-medium text-start mb-2.5">
            Experience Overview
          </p>
          <div className="flex gap-2 items-center py-3 px-4 bg-dark my-2.5 rounded-lg text-gray-800 text-sm font-medium">
            <Image
              src={assets.starIcon}
              className="w-6 h-auto sm:w-8"
              alt="star"
              width={32}
              height={32}
            />
            <p>{ratingData.average.toFixed(1)}/5 Average Rating</p>
          </div>
          <div className="flex gap-2 items-center py-3 px-4 bg-dark my-2.5 rounded-lg text-gray-800 text-sm font-medium">
            <Image
              src={assets.badge}
              className="w-6 h-auto sm:w-8"
              alt="badge"
              width={32}
              height={32}
            />
            <p>Based on {ratingData.count} verified reviews</p>
          </div>
          <div className="flex gap-2 items-center py-3 px-4 bg-dark my-2.5 rounded-lg text-gray-800 text-sm font-medium">
            <Image
              src={assets.badge2}
              className="w-6 h-auto sm:w-8"
              alt="badge2"
              width={32}
              height={32}
            />
            <p>TripAdvisor Certified</p>
          </div>
        </div>
        <div
          ref={sliderRef}
          className="scrollbar-hide flex gap-4 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
        >
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="min-w-[90vw] sm:min-w-[500px] lg:min-w-[600px] max-w-[90vw] sm:max-w-[500px] lg:max-w-[650px] p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow flex flex-col justify-between snap-start"
              >
                {/* Review text */}
                <p className="text-start mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                  {review.comment ||
                    "This journey was incredible! The stunning landscapes and raw power of nature amazed me. Perfect locations, cozy accommodations, and smooth transport. I've already booked my next adventure!"}
                </p>

                {/* Star Rating */}
                {renderStars(review.rating)}

                {/* Reviewer Info */}
                <div className="flex gap-4 items-center mt-auto">
                  <img
                    src={review.image || assets.daniel.src}
                    alt={review.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = assets.daniel.src;
                    }}
                  />
                  <div>
                    <h1 className="font-semibold text-base sm:text-lg">
                      {review.name}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Verified Traveler
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="min-w-[90vw] sm:min-w-[500px] lg:min-w-[600px] max-w-[90vw] sm:max-w-[500px] lg:max-w-[650px] p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow flex flex-col justify-center items-center snap-start">
              <p className="text-center text-gray-500">
                No reviews available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
