"use client";

import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  MIN: number;
  MAX: number;
}

const STEP = 100;

const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  MIN,
  MAX,
}: PriceRangeFilterProps) => {
  const [values, setValues] = useState([minPrice, maxPrice]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setValues([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  if (!isMounted) {
    return (
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Price
        </label>
        <div className="flex items-center justify-between bg-white rounded-md border border-gray-300 px-3 py-1.5">
          <span className="text-sm text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Price
      </label>

      <div className="flex items-center justify-between bg-white rounded-md border border-gray-300 px-3 py-1.5">
        <span className="text-sm text-gray-700">
          ${values[0].toLocaleString()} - ${values[1].toLocaleString()}
        </span>

        <div className="flex-1 ml-4">
          <Range
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => setValues(values)}
            onFinalChange={(values) => {
              // Update URL with new price values
              const url = new URL(window.location.href);
              url.searchParams.set("min_price", values[0].toString());
              url.searchParams.set("max_price", values[1].toString());
              window.location.href = url.toString();
            }}
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
                      values,
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
  );
};

export default PriceRangeFilter;
