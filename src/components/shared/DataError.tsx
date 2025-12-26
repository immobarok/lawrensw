"use client";

import Image from "next/image";
import { assets } from "../../../public/assets/assets";

interface DataErrorProps {
  title?: string;
  className?: string;
  message?: string;
}

const DataError = ({
  title = "Data not found at this moment!",
  className = "",
  message = "We couldn't find any data to display right now. Please try again later.",
}: DataErrorProps) => {
  return (
    <div className={`rounded-2xl text-center ${className}`}>
      {/* Custom CSS for side-to-side animation */}
      <style jsx>{`
        @keyframes slide-left-right {
          0% {
            transform: translateX(-20px);
          }
          50% {
            transform: translateX(20px);
          }
          100% {
            transform: translateX(-20px);
          }
        }

        @keyframes gentle-sway {
          0% {
            transform: translateX(-6px);
          }
          50% {
            transform: translateX(6px);
          }
          100% {
            transform: translateX(-6px);
          }
        }

        .sliding-icon {
          animation: slide-left-right 3s linear infinite;
        }

        .gentle-sway {
          animation: gentle-sway 2s linear infinite;
        }
      `}</style>

      {/* Icon container with enhanced styling */}
      <div className="flex justify-center items-center mb-6">
        <div className="relative">
          <div className=" sliding-icon">
            <Image
              src={assets.emptyIcon}
              alt="No Data"
              width={80}
              height={80}
              className="mx-auto opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-105 filter drop-shadow-sm gentle-sway"
            />
          </div>
        </div>
      </div>

      {/* Enhanced text styling */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-900 tracking-tight">
          {title}
        </h3>
        {message && (
          <p className="text-blue/60 text-sm leading-relaxed max-w-md mx-auto font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DataError;
