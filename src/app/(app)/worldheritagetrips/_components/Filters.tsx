"use client";
import "react-datepicker/dist/react-datepicker.css";

import { useRouter } from "next/navigation";
import { Range, getTrackBackground } from "react-range";
import { useState, useEffect, useRef } from "react";
import { useTranslatedText } from "@/hook/useTranslation";

interface FiltersProps {
  startDate: string;
  duration: string;
  ship: string;
  shipSize: string;
  destination: string;
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

  const destinationLabel = useTranslatedText("Destination");
  const startDateLabel = useTranslatedText("Start date after");
  const durationLabel = useTranslatedText("Duration");
  const selectDurationText = useTranslatedText("Select Duration");
  const selectDestinationText = useTranslatedText("Any Destination");
  const oneTothreeDaysText = useTranslatedText("1-3 days");
  const fourToSevenDaysText = useTranslatedText("4-7 days");
  const eightToFourteenDaysText = useTranslatedText("8-14 days");
  const fifteenPlusDaysText = useTranslatedText("15+ days");

  // Destination translations
  const antarcticaText = useTranslatedText("Antarctica");
  const arcticText = useTranslatedText("Arctic");
  const newZealandText = useTranslatedText("New Zealand");
  const norwayText = useTranslatedText("Norway");
  const greenlandText = useTranslatedText("Greenland");
  const patagoniaText = useTranslatedText("Patagonia");
  const southGeorgiaText = useTranslatedText("South Georgia");
  const falklandIslandsText = useTranslatedText("Falkland Islands");
  const subantarcticIslandsText = useTranslatedText("Subantarctic Islands");
  const southPacificText = useTranslatedText("South Pacific");
  const australiaText = useTranslatedText("Australia");
  const japanText = useTranslatedText("Japan");
  const svalbardText = useTranslatedText("Svalbard");

  const shipLabel = useTranslatedText("Ship");
  const anyShipText = useTranslatedText("Any ship");
  const heritageAdventurerText = useTranslatedText("Heritage Adventurer");
  const heritageExplorerText = useTranslatedText("Heritage Explorer");

  const shipSizeLabel = useTranslatedText("Ship size");
  const anySizeText = useTranslatedText("Any Size");
  const smallSizeText = useTranslatedText("Small (1-50 guests)");
  const mediumSizeText = useTranslatedText("Medium (51-100 guests)");
  const largeSizeText = useTranslatedText("Large (100+ guests)");

  const priceRangeLabel = useTranslatedText("Price");

  const getDestinationDisplayText = (destinationValue: string) => {
    if (!destinationValue) return selectDestinationText;

    const destinationMap: Record<string, string> = {
      Antarctica: antarcticaText,
      Arctic: arcticText,
      "New Zealand": newZealandText,
      Norway: norwayText,
      Greenland: greenlandText,
      Patagonia: patagoniaText,
      "South Georgia": southGeorgiaText,
      "Falkland Islands": falklandIslandsText,
      "Subantarctic Islands": subantarcticIslandsText,
      "South Pacific": southPacificText,
      Australia: australiaText,
      Japan: japanText,
      Svalbard: svalbardText,
    };

    return destinationMap[destinationValue] || destinationValue;
  };

  // Helper function to get translated duration display text
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

  // Helper function to get translated ship display text
  const getShipDisplayText = (shipValue: string) => {
    if (!shipValue) return anyShipText;

    const shipMap: Record<string, string> = {
      "Heritage Adventurer": heritageAdventurerText,
      "Heritage Explorer": heritageExplorerText,
    };

    return shipMap[shipValue] || shipValue;
  };

  // Helper function to get translated ship size display text
  const getShipSizeDisplayText = (shipSizeValue: string) => {
    if (!shipSizeValue) return anySizeText;

    const shipSizeMap: Record<string, string> = {
      "Small (1-50 guests)": smallSizeText,
      "Medium (51-100 guests)": mediumSizeText,
      "Large (100+ guests)": largeSizeText,
    };

    return shipSizeMap[shipSizeValue] || shipSizeValue;
  };

  const [priceValues, setPriceValues] = useState([
    initialMinPrice,
    initialMaxPrice,
  ]);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localDuration, setLocalDuration] = useState(duration);
  const [localDestination, setLocalDestination] = useState(destination);
  const [localShip, setLocalShip] = useState(ship);
  const [localShipSize, setLocalShipSize] = useState(shipSize);
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

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalDuration(duration);
    setLocalDestination(destination);
    setLocalShip(ship);
    setLocalShipSize(shipSize);
    setPriceValues([initialMinPrice, initialMaxPrice]);
  }, [
    startDate,
    duration,
    destination,
    ship,
    shipSize,
    initialMinPrice,
    initialMaxPrice,
  ]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close destination dropdown if clicked outside
      if (
        isDestinationDropdownOpen &&
        destinationDropdownRef.current &&
        !destinationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDestinationDropdownOpen(false);
      }

      // Close duration dropdown if clicked outside
      if (
        isDurationDropdownOpen &&
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDurationDropdownOpen(false);
      }

      // Close ship dropdown if clicked outside
      if (
        isShipDropdownOpen &&
        shipDropdownRef.current &&
        !shipDropdownRef.current.contains(event.target as Node)
      ) {
        setIsShipDropdownOpen(false);
      }

      // Close ship size dropdown if clicked outside
      if (
        isShipSizeDropdownOpen &&
        shipSizeDropdownRef.current &&
        !shipSizeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsShipSizeDropdownOpen(false);
      }
    };

    // Add event listener when any dropdown is open
    if (
      isDestinationDropdownOpen ||
      isDurationDropdownOpen ||
      isShipDropdownOpen ||
      isShipSizeDropdownOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isDestinationDropdownOpen,
    isDurationDropdownOpen,
    isShipDropdownOpen,
    isShipSizeDropdownOpen,
  ]);

  const updateUrl = (newParams: Record<string, string>) => {
    const url = new URL(window.location.href);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    url.searchParams.set("page", "1");
    router.push(url.toString(), { scroll: false });
  };

  const handleFilterChange = (key: string, value: string) => {
    switch (key) {
      case "destination":
        setLocalDestination(value);
        // Use "destinations" for URL parameter (plural for backend)
        updateUrl({ destinations: value });
        break;
      case "departure_date":
        setLocalStartDate(value);
        updateUrl({ [key]: value });
        break;
      case "duration":
        setLocalDuration(value);
        updateUrl({ [key]: value });
        break;
      case "ship":
        setLocalShip(value);
        updateUrl({ [key]: value });
        break;
      case "shipSize":
        setLocalShipSize(value);
        updateUrl({ [key]: value });
        break;
      default:
        updateUrl({ [key]: value });
        break;
    }
  };

  const handleDurationChange = (value: string) => {
    setLocalDuration(value);
    if (value === "") {
      updateUrl({ min_duration: "", max_duration: "" });
    } else {
      const durationMap: Record<string, { min: string; max: string }> = {
        "1-3 days": { min: "1", max: "3" },
        "4-7 days": { min: "4", max: "7" },
        "8-14 days": { min: "8", max: "14" },
        "15+ days": { min: "15", max: "" },
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
    updateUrl({
      min_price: values[0].toString(),
      max_price: values[1].toString(),
    });
  };

  return (
    <div>
      {/* First Row of Filters */}
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
              {getDestinationDisplayText(localDestination)}
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

            {/* Destination Dropdown menu */}
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
                        console.log(
                          "Any Destination clicked - clearing filter"
                        );
                        handleFilterChange("destination", "");
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === ""
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {selectDestinationText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log("Antarctica destination selected");
                        handleFilterChange("destination", "Antarctica");
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === "Antarctica"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {antarcticaText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log("New Zealand destination selected");
                        handleFilterChange("destination", "New Zealand");
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === "New Zealand"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {newZealandText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log(
                          "Subantarctic Islands destination selected"
                        );
                        handleFilterChange(
                          "destination",
                          "Subantarctic Islands"
                        );
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === "Subantarctic Islands"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {subantarcticIslandsText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log("South Pacific destination selected");
                        handleFilterChange("destination", "South Pacific");
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === "South Pacific"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {southPacificText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log("Australia destination selected");
                        handleFilterChange("destination", "Australia");
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === "Australia"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {australiaText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log("Japan destination selected");
                        handleFilterChange("destination", "Japan");
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === "Japan"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {japanText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        console.log("Svalbard destination selected");
                        handleFilterChange("destination", "Svalbard");
                        setIsDestinationDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer ${
                        localDestination === "Svalbard"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {svalbardText}
                    </button>
                  </li>
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
              placeholder="Select Start Date"
              value={localStartDate}
              onChange={(e) =>
                handleFilterChange("departure_date", e.target.value)
              }
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
                {getDurationDisplayText(localDuration)}
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

              {/* Duration Dropdown menu */}
              {isDurationDropdownOpen && (
                <div
                  id="durationDropdown"
                  className="z-50 absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full "
                >
                  <ul
                    className="py-2 text-sm text-black"
                    aria-labelledby="durationDropdownButton"
                  >
                    <li>
                      <button
                        onClick={() => {
                          handleDurationChange("");
                          setIsDurationDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                      >
                        {selectDurationText}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleDurationChange("1-3 days");
                          setIsDurationDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                      >
                        {oneTothreeDaysText}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleDurationChange("4-7 days");
                          setIsDurationDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                      >
                        {fourToSevenDaysText}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleDurationChange("8-14 days");
                          setIsDurationDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                      >
                        {eightToFourteenDaysText}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleDurationChange("15+ days");
                          setIsDurationDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                      >
                        {fifteenPlusDaysText}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
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
              {getShipDisplayText(localShip)}
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

            {/* Ship Dropdown menu */}
            {isShipDropdownOpen && (
              <div
                id="shipDropdown"
                className="z-50 absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full "
              >
                <ul
                  className="py-2 text-sm text-black"
                  aria-labelledby="shipDropdownButton"
                >
                  <li>
                    <button
                      onClick={() => {
                        handleFilterChange("ship", "");
                        setIsShipDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {anyShipText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleFilterChange("ship", "Heritage Adventurer");
                        setIsShipDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {heritageAdventurerText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleFilterChange("ship", "Heritage Explorer");
                        setIsShipDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {heritageExplorerText}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-white mb-2">
            {shipSizeLabel}
          </label>
          <div className="relative" ref={shipSizeDropdownRef}>
            <button
              id="shipSizeDropdownButton"
              onClick={() => setIsShipSizeDropdownOpen(!isShipSizeDropdownOpen)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white text-black text-sm sm:text-base text-left inline-flex items-center justify-between"
              type="button"
            >
              {getShipSizeDisplayText(localShipSize)}
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

            {/* Ship Size Dropdown menu */}
            {isShipSizeDropdownOpen && (
              <div
                id="shipSizeDropdown"
                className="z-50 absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full "
              >
                <ul
                  className="py-2 text-sm text-black"
                  aria-labelledby="shipSizeDropdownButton"
                >
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(
                          "Any Size clicked - setting ship size to empty"
                        );
                        handleFilterChange("shipSize", "");
                        setIsShipSizeDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {anySizeText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Small ship size clicked");
                        handleFilterChange("shipSize", "Small (1-50 guests)");
                        setIsShipSizeDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {smallSizeText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Medium ship size clicked");
                        handleFilterChange(
                          "shipSize",
                          "Medium (51-100 guests)"
                        );
                        setIsShipSizeDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {mediumSizeText}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Large ship size clicked");
                        handleFilterChange("shipSize", "Large (100+ guests)");
                        setIsShipSizeDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                    >
                      {largeSizeText}
                    </button>
                  </li>
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
