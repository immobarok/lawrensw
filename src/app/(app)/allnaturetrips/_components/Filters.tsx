"use client";

import { useRouter } from "next/navigation";
import { Range, getTrackBackground } from "react-range";
import { useState, useEffect } from "react";

interface FiltersProps {
  destination: string;
  startDate: string;
  duration: string;
  ship: string;
  shipSize: string;
  minPrice: number;
  maxPrice: number;
  MIN: number;
  MAX: number;
  STEP: number;
}

const Filters = ({
  destination,
  startDate,
  duration,
  ship,
  shipSize,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  MIN,
  MAX,
  STEP,
}: FiltersProps) => {
  const router = useRouter();
  const [priceValues, setPriceValues] = useState([
    initialMinPrice,
    initialMaxPrice,
  ]);
  const [localDestination, setLocalDestination] = useState(destination);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localDuration, setLocalDuration] = useState(duration);
  const [localShip, setLocalShip] = useState(ship);
  const [localShipSize, setLocalShipSize] = useState(shipSize);

  // Update local state when URL params change
  useEffect(() => {
    setLocalDestination(destination);
    setLocalStartDate(startDate);
    setLocalDuration(duration);
    setLocalShip(ship);
    setLocalShipSize(shipSize);
    setPriceValues([initialMinPrice, initialMaxPrice]);
  }, [
    destination,
    startDate,
    duration,
    ship,
    shipSize,
    initialMinPrice,
    initialMaxPrice,
  ]);

  const updateUrl = (newParams: Record<string, string>) => {
    const url = new URL(window.location.href);

    // Update all parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    // Always reset to page 1 when filters change
    url.searchParams.set("page", "1");

    // Use shallow routing to avoid full page reload
    router.push(url.toString(), { scroll: false });
  };

  const handleFilterChange = (key: string, value: string) => {
    // Update local state immediately for instant UI response
    switch (key) {
      case "destinations":
        setLocalDestination(value);
        break;
      case "departure_date":
        setLocalStartDate(value);
        break;
      case "duration":
        setLocalDuration(value);
        break;
      case "ship":
        setLocalShip(value);
        break;
      case "shipSize":
        setLocalShipSize(value);
        break;
    }

    // Update URL in the background
    updateUrl({ [key]: value });
  };

  const handleDurationChange = (value: string) => {
    setLocalDuration(value);

    // Handle duration filter based on API requirements
    if (value === "") {
      // Clear duration filters
      updateUrl({ min_duration: "", max_duration: "" });
    } else {
      // Set min_duration and max_duration based on selected range
      const durationMap: Record<string, { min: string; max: string }> = {
        "1-3 days": { min: "1", max: "3" },
        "4-7 days": { min: "4", max: "7" },
        "8-14 days": { min: "8", max: "14" },
        "15+ days": { min: "15", max: "" }, // No upper limit for 15+ days
      };

      const durationParams = durationMap[value];
      updateUrl({
        min_duration: durationParams.min,
        max_duration: durationParams.max,
      });
    }
  };

  const handlePriceChange = (values: number[]) => {
    setPriceValues(values);
  };

  const handlePriceFinalChange = (values: number[]) => {
    // Reset to page 1 when price filter changes since we're filtering on frontend
    const url = new URL(window.location.href);
    url.searchParams.set("min_price", values[0].toString());
    url.searchParams.set("max_price", values[1].toString());
    url.searchParams.set("page", "1");

    router.push(url.toString(), { scroll: false });
  };

  return (
    <div>
      {/* First Row of Filters */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        <div className="w-full md:w-1/2">
          <label className="block text-xs sm:text-sm font-medium text-white mb-2">
            Trip Destination
          </label>
          <select
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base"
            value={localDestination}
            onChange={(e) => handleFilterChange("destinations", e.target.value)}
          >
            <option value="">All Destination</option>
            <option>Antarctic</option>
            <option>Greenland</option>
            <option>Antarctic Peninsula</option>
            <option>South Orkney Islands</option>
            <option>Falkland Island</option>
            <option>South Georgia</option>
            <option>Svalbard</option>
          </select>
        </div>

        <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm font-medium text-white mb-2">
              Start date after
            </label>
            <input
              type="date"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base"
              placeholder="Select Start Date"
              value={localStartDate}
              onChange={(e) =>
                handleFilterChange("departure_date", e.target.value)
              }
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm font-medium text-white mb-2">
              Duration
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base"
              value={localDuration}
              onChange={(e) => handleDurationChange(e.target.value)}
            >
              <option value="">Select Duration</option>
              <option>1-3 days</option>
              <option>4-7 days</option>
              <option>8-14 days</option>
              <option>15+ days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Second Row of Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-white mb-2">
            Ship
          </label>
          <select
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base"
            value={localShip}
            onChange={(e) => handleFilterChange("ship", e.target.value)}
          >
            <option value="">Any ship</option>
            <option>s/v Rembrandt van Rijn</option>
            <option>m/v Ortelius</option>
            <option>m/v Plancius</option>
            <option>m/v Hondius</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-white mb-2">
            Ship size
          </label>
          <select
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base"
            value={localShipSize}
            onChange={(e) => handleFilterChange("shipSize", e.target.value)}
          >
            <option value="">Any Size</option>
            <option>Small (1-50 guests)</option>
            <option>Medium (51-100 guests)</option>
            <option>Large (100+ guests)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Price
          </label>

          <div className="flex items-center justify-between bg-white rounded-md border border-gray-300 px-3 py-0 md:py-1.5 -mt-[1px]">
            <span className="text-sm text-gray-700">
              ${priceValues[0].toLocaleString()} - $
              {priceValues[1].toLocaleString()}
            </span>

            <div className="flex-1 ml-4">
              <Range
                values={priceValues}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={handlePriceChange}
                onFinalChange={handlePriceFinalChange}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "36px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      ref={props.ref}
                      className="h-1.5 w-full rounded-full self-center"
                      style={{
                        background: getTrackBackground({
                          values: priceValues,
                          colors: ["#E5E7EB", "#2563EB", "#E5E7EB"],
                          min: MIN,
                          max: MAX,
                        }),
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props, isDragged }) => {
                  const { key, ...restProps } = props;
                  return (
                    <div
                      key={key}
                      {...restProps}
                      className={`h-4 w-4 rounded-full flex items-center justify-center bg-blue-600 border-2 border-white shadow ${
                        isDragged ? "ring-2 ring-blue-300" : ""
                      }`}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
