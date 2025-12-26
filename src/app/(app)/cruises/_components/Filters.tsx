"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Range, getTrackBackground } from "react-range";
import { useTranslatedText } from "@/hook/useTranslation";
import type { TripFiltersState } from "./types";

type FiltersProps = {
  filters: TripFiltersState;
  priceBounds: {
    min: number;
    max: number;
    step: number;
  };
  destinationOptions: string[];
  shipOptions: string[];
  shipSizeOptions: string[];
  onFiltersChange: (changes: Partial<TripFiltersState>) => void;
};

const DURATION_OPTIONS = ["1-3 days", "4-7 days", "8-14 days", "15+ days"];

const Filters = ({
  filters,
  priceBounds,
  destinationOptions,
  shipOptions,
  shipSizeOptions,
  onFiltersChange,
}: FiltersProps) => {
  const [priceValues, setPriceValues] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  // Debounced price update
  const [priceTimeout, setPriceTimeout] = useState<NodeJS.Timeout>();

  // Dropdown states
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] =
    useState(false);
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [isShipDropdownOpen, setIsShipDropdownOpen] = useState(false);
  const [isShipSizeDropdownOpen, setIsShipSizeDropdownOpen] = useState(false);

  // Refs for dropdown containers
  const destinationDropdownRef = useRef<HTMLDivElement>(null);
  const durationDropdownRef = useRef<HTMLDivElement>(null);
  const shipDropdownRef = useRef<HTMLDivElement>(null);
  const shipSizeDropdownRef = useRef<HTMLDivElement>(null);

  // Translated labels
  const destinationLabel = useTranslatedText("Destination");
  const startDateLabel = useTranslatedText("Start date after");
  const durationLabel = useTranslatedText("Duration");
  const selectDurationText = useTranslatedText("Select Duration");
  const selectDestinationText = useTranslatedText("Any Destination");
  const oneTothreeDaysText = useTranslatedText("1-3 days");
  const fourToSevenDaysText = useTranslatedText("4-7 days");
  const eightToFourteenDaysText = useTranslatedText("8-14 days");
  const fifteenPlusDaysText = useTranslatedText("15+ days");

  const shipLabel = useTranslatedText("Ship");
  const anyShipText = useTranslatedText("Any ship");

  const shipSizeLabel = useTranslatedText("Ship size");
  const anySizeText = useTranslatedText("Any Size");
  const smallSizeText = useTranslatedText("Small (1-50 guests)");
  const mediumSizeText = useTranslatedText("Medium (51-100 guests)");
  const largeSizeText = useTranslatedText("Large (100+ guests)");

  const priceRangeLabel = useTranslatedText("Price");

  useEffect(() => {
    setPriceValues([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDestinationDropdownOpen &&
        destinationDropdownRef.current &&
        !destinationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDestinationDropdownOpen(false);
      }

      if (
        isDurationDropdownOpen &&
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDurationDropdownOpen(false);
      }

      if (
        isShipDropdownOpen &&
        shipDropdownRef.current &&
        !shipDropdownRef.current.contains(event.target as Node)
      ) {
        setIsShipDropdownOpen(false);
      }

      if (
        isShipSizeDropdownOpen &&
        shipSizeDropdownRef.current &&
        !shipSizeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsShipSizeDropdownOpen(false);
      }
    };

    if (
      isDestinationDropdownOpen ||
      isDurationDropdownOpen ||
      isShipDropdownOpen ||
      isShipSizeDropdownOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isDestinationDropdownOpen,
    isDurationDropdownOpen,
    isShipDropdownOpen,
    isShipSizeDropdownOpen,
  ]);

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({ startDate: event.target.value });
    },
    [onFiltersChange]
  );

  const getDurationDisplayText = (durationValue: string) => {
    if (!durationValue) return selectDurationText;

    const durationMap: Record<string, string> = {
      "1-3 days": oneTothreeDaysText,
      "4-7 days": fourToSevenDaysText,
      "8-14 days": eightToFourteenDaysText,
      "15+ days": fifteenPlusDaysText,
    };

    return durationMap[durationValue] || durationValue;
  };

  const getShipSizeDisplayText = (shipSizeValue: string) => {
    if (!shipSizeValue) return anySizeText;

    const shipSizeMap: Record<string, string> = {
      "Small (1-50 guests)": smallSizeText,
      "Medium (51-100 guests)": mediumSizeText,
      "Large (100+ guests)": largeSizeText,
    };

    return shipSizeMap[shipSizeValue] || shipSizeValue;
  };

  const handlePriceChange = useCallback((values: number[]) => {
    setPriceValues([values[0], values[1]]);
  }, []);

  const handlePriceFinalChange = useCallback(
    (values: number[]) => {
      if (priceTimeout) {
        clearTimeout(priceTimeout);
      }
      onFiltersChange({ minPrice: values[0], maxPrice: values[1] });
    },
    [onFiltersChange, priceTimeout]
  );

  // Debounced price update for smoother UX
  const handlePriceUpdate = useCallback(
    (values: number[]) => {
      if (priceTimeout) {
        clearTimeout(priceTimeout);
      }

      const newTimeout = setTimeout(() => {
        onFiltersChange({ minPrice: values[0], maxPrice: values[1] });
      }, 300);

      setPriceTimeout(newTimeout);
    },
    [onFiltersChange, priceTimeout]
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        <div className="w-full md:w-1/2">
          <label className="block text-xs sm:text-sm font-medium text-white mb-2">
            {destinationLabel}
          </label>
          <div className="relative" ref={destinationDropdownRef}>
            <button
              id="destinationDropdownButton"
              onClick={() =>
                setIsDestinationDropdownOpen(!isDestinationDropdownOpen)
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base text-left inline-flex items-center justify-between"
              type="button"
            >
              {filters.destination || selectDestinationText}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {isDestinationDropdownOpen && (
              <div
                id="destinationDropdown"
                className="z-50 absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full"
              >
                <ul
                  className="py-2 text-sm text-black"
                  aria-labelledby="destinationDropdownButton"
                >
                  <li>
                    <button
                      onClick={() => {
                        onFiltersChange({ destination: "" });
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        filters.destination === ""
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {selectDestinationText}
                    </button>
                  </li>
                  {destinationOptions.map((destination) => (
                    <li key={destination}>
                      <button
                        onClick={() => {
                          onFiltersChange({ destination });
                          setIsDestinationDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                          filters.destination === destination
                            ? "bg-gray-100 font-semibold"
                            : ""
                        }`}
                      >
                        {destination}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm font-medium text-white mb-2">
              {startDateLabel}
            </label>
            <input
              type="date"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base"
              value={filters.startDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm font-medium text-white mb-2">
              {durationLabel}
            </label>
            <div className="relative" ref={durationDropdownRef}>
              <button
                id="durationDropdownButton"
                onClick={() =>
                  setIsDurationDropdownOpen(!isDurationDropdownOpen)
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base text-left inline-flex items-center justify-between"
                type="button"
              >
                {getDurationDisplayText(filters.duration)}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isDurationDropdownOpen && (
                <div
                  id="durationDropdown"
                  className="z-50 absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full"
                >
                  <ul
                    className="py-2 text-sm text-black"
                    aria-labelledby="durationDropdownButton"
                  >
                    <li>
                      <button
                        onClick={() => {
                          onFiltersChange({ duration: "" });
                          setIsDurationDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                      >
                        {selectDurationText}
                      </button>
                    </li>
                    {DURATION_OPTIONS.map((option) => (
                      <li key={option}>
                        <button
                          onClick={() => {
                            onFiltersChange({ duration: option });
                            setIsDurationDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                        >
                          {getDurationDisplayText(option)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-white mb-2">
            {shipLabel}
          </label>
          <div className="relative" ref={shipDropdownRef}>
            <button
              id="shipDropdownButton"
              onClick={() => setIsShipDropdownOpen(!isShipDropdownOpen)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base text-left inline-flex items-center justify-between"
              type="button"
            >
              {filters.ship || anyShipText}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {isShipDropdownOpen && (
              <div
                id="shipDropdown"
                className="z-50 absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full"
              >
                <ul
                  className="py-2 text-sm text-black"
                  aria-labelledby="shipDropdownButton"
                >
                  <li>
                    <button
                      onClick={() => {
                        onFiltersChange({ ship: "" });
                        setIsShipDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {anyShipText}
                    </button>
                  </li>
                  {shipOptions.map((ship) => (
                    <li key={ship}>
                      <button
                        onClick={() => {
                          onFiltersChange({ ship });
                          setIsShipDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                      >
                        {ship}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            {priceRangeLabel}
          </label>

          <div className="flex items-center justify-between bg-white rounded-md border border-gray-300 px-3 py-0 md:py-1.5 -mt-[1px]">
            <span className="text-sm text-gray-700">
              ${priceValues[0].toLocaleString()} - $
              {priceValues[1].toLocaleString()}
            </span>

            <div className="flex-1 ml-4">
              <Range
                values={priceValues}
                step={priceBounds.step}
                min={priceBounds.min}
                max={priceBounds.max}
                onChange={(values) => {
                  handlePriceChange(values);
                  handlePriceUpdate(values);
                }}
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
                          min: priceBounds.min,
                          max: priceBounds.max,
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
