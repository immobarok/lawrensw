"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ComponentProps, KeyboardEvent } from "react";
import { Trip, getTripDetailsUrl } from "@/api/trip/AllTrips";
import { assets } from "../../../../../public/assets/assets";
import TripOneCard from "../../worldheritagetrips/_components/TipsCard";
import TripTwoCard from "../../allnaturetrips/_components/TipsCard";

type TripCardProps = {
  trip: Trip;
};

type TripOneCardProps = ComponentProps<typeof TripOneCard>;
type TripTwoCardProps = ComponentProps<typeof TripTwoCard>;

type TripExtras = {
  feature_image?: string;
  highlights?: string;
  duration?: number;
  ship?: { name?: string };
  cabins?: { amount?: string | number }[];
  cabins_twos?: { price?: string | number }[];
  destinations?: { name?: string }[];
};

const sanitize = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const cleaned = value.replace(/<[^>]*>/g, "").trim();
  return cleaned.length > 0 ? cleaned : undefined;
};

const toDateLabel = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString() : "Date not available";

const toDurationLabel = (days?: number | null) =>
  days && days > 0 ? `${days} Days` : "Duration not available";

const getLowestAmount = (items?: { amount?: string | number }[]) => {
  if (!items || items.length === 0) {
    return null;
  }

  const parsed = items
    .map((item) => {
      if (typeof item?.amount === "number") {
        return item.amount;
      }

      if (typeof item?.amount === "string" && item.amount.trim().length > 0) {
        const value = Number.parseFloat(item.amount);
        return Number.isFinite(value) ? value : null;
      }

      return null;
    })
    .filter((value): value is number => value !== null);

  return parsed.length > 0 ? Math.min(...parsed) : null;
};

const getLowestPrice = (items?: { price?: string | number }[]) => {
  if (!items || items.length === 0) {
    return null;
  }

  const parsed = items
    .map((item) => {
      if (typeof item?.price === "number") {
        return item.price;
      }

      if (typeof item?.price === "string" && item.price.trim().length > 0) {
        const value = Number.parseFloat(item.price);
        return Number.isFinite(value) ? value : null;
      }

      return null;
    })
    .filter((value): value is number => value !== null);

  return parsed.length > 0 ? Math.min(...parsed) : null;
};

const toPriceLabel = (price: number | null | undefined) =>
  typeof price === "number" ? `$ ${price.toFixed(2)}` : "Price not available";

const TripCard = ({ trip }: TripCardProps) => {
  const router = useRouter();
  const detailsUrl = getTripDetailsUrl(trip, "cruises");
  const extras = trip as Trip & TripExtras;

  const buildTripOneData = (): TripOneCardProps["trips"] => {
    const lowestAmount =
      getLowestAmount(extras.cabins) ?? getLowestPrice(extras.cabins_twos);

    return {
      id: trip.id,
      title: trip.name,
      category:
        extras.destinations?.[0]?.name ||
        trip.destinations_twos?.[0]?.name ||
        trip.region ||
        "Nature Trip",
      date: toDateLabel(trip.departure_date),
      image: extras.feature_image || trip.photos?.[0]?.url || assets.NatureTrip,
      description:
        sanitize(extras.highlights) ||
        sanitize(trip.summary) ||
        "No description available",
      duration:
        extras.duration && extras.duration > 0
          ? `${extras.duration} Days`
          : toDurationLabel(trip.days),
      ship:
        extras.ship?.name || trip.ship_name || "Ship information not available",
      price: toPriceLabel(lowestAmount),
      cta: "View expedition cruise",
      ctaLink: detailsUrl,
    };
  };

  const buildTripTwoData = (): TripTwoCardProps["trip"] => {
    const lowestPrice = getLowestPrice(extras.cabins_twos);

    return {
      id: trip.id,
      title: trip.name,
      category:
        trip.destinations_twos
          ?.map((destination) => destination.name)
          .join(", ") ||
        trip.region ||
        "Nature Trip",
      date: toDateLabel(trip.departure_date),
      image: trip.photos?.[0]?.url || assets.NatureTrip,
      description:
        sanitize(trip.summary) ||
        sanitize(extras.highlights) ||
        "No description available",
      duration: toDurationLabel(trip.days),
      ship: trip.ship_name || "Ship information not available",
      price: lowestPrice
        ? `$ ${lowestPrice.toFixed(2)}`
        : "Price not available",
      cta: "View expedition cruise",
      ctaLink: detailsUrl,
    };
  };

  const buildFallbackCard = () => {
    const imageSrc = trip.photos?.[0]?.url || assets.NatureTrip;
    const categoryLabel =
      trip.destinations_twos
        ?.map((destination) => destination.name)
        .join(", ") ||
      extras.destinations?.map((destination) => destination.name).join(", ") ||
      trip.region ||
      "Expedition";
    const departureLabel = toDateLabel(trip.departure_date);
    const durationLabel = toDurationLabel(trip.days);
    const summaryText = sanitize(trip.summary) || "No description available";

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col">
        <Image
          src={imageSrc}
          alt={trip.name}
          width={800}
          height={400}
          className="w-full h-56 object-cover rounded-2xl"
        />

        <div className="pt-8 flex flex-col flex-1">
          <div className="flex justify-between items-center gap-2 mb-3 flex-nowrap">
            <span className="py-1 text-secondary text-xs font-medium rounded-full">
              {categoryLabel}
            </span>
            <p className="px-3 py-1 bg-secondary-light/30 text-gray-800 text-xs rounded-full text-center w-24">
              {departureLabel}
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{trip.name}</h2>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
            {summaryText}
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
            <div className="space-y-2">
              <div className="flex gap-1 items-center">
                <Image
                  src={assets.Clock}
                  width={16}
                  height={16}
                  alt="Duration icon"
                  style={{ height: "auto", width: "16px" }}
                />
                <span>Duration</span>
              </div>
              <span className="block font-medium text-gray-900">
                {durationLabel}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex gap-1 items-center">
                <Image
                  src={assets.shipIcon}
                  width={16}
                  height={16}
                  alt="Ship icon"
                />
                <span>Ship</span>
              </div>
              <span className="block font-medium text-gray-900">
                {trip.ship_name || "Ship information not available"}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex gap-1 items-center">
                <Image
                  src={assets.priceTag}
                  width={16}
                  height={16}
                  alt="Price icon"
                />
                <span>Price starting from</span>
              </div>
              <span className="block font-medium text-gray-900">
                Contact us
              </span>
            </div>
          </div>

          <Link
            href={detailsUrl}
            onClick={(event) => event.stopPropagation()}
            className="block text-center w-full py-2.5 bg-secondary text-white text-sm font-medium rounded-lg transition-colors mt-auto"
          >
            View expedition cruise
          </Link>
        </div>
      </div>
    );
  };

  const renderCard = () => {
    if (trip.trip_type === "trip_one") {
      return <TripOneCard trips={buildTripOneData()} />;
    }

    if (trip.trip_type === "trip_two") {
      return <TripTwoCard trip={buildTripTwoData()} />;
    }

    return buildFallbackCard();
  };

  const navigateToDetails = () => {
    router.push(detailsUrl);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToDetails();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      onClick={navigateToDetails}
      onKeyDown={handleKeyDown}
    >
      {renderCard()}
    </div>
  );
};

export default TripCard;
