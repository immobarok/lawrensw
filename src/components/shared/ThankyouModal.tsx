"use client";

import { useState, useEffect } from "react";
import { BiCross } from "react-icons/bi";
import Link from "next/link";
import { GiCheckMark } from "react-icons/gi";
import { CgChevronDoubleLeft, CgChevronDoubleRight } from "react-icons/cg";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  showViewBookings?: boolean;
}

const ThankYouModal = ({
  isOpen,
  onClose,
  title = "Thank You!",
  message = "Your booking has been confirmed successfully. We've sent you a confirmation email with all the details.",
  showViewBookings = true,
}: ThankYouModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isMounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-2 md:px-0"
      onClick={handleBackdropClick}
    >
      <div
        className={`absolute inset-0 bg-black/10 backdrop-blur-md transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mx-2 sm:mx-4 max-w-lg w-full transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
          aria-label="Close modal"
        >
          <BiCross className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-6 p-3 rounded-full bg-[#013A8A]/10 transition-transform duration-700 ${
              isVisible ? "scale-100 rotate-0" : "scale-0 rotate-45"
            }`}
            style={{
              transitionTimingFunction:
                "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            }}
          >
            <GiCheckMark className="w-16 h-16 text-[#013A8A]" />
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-3 transition-all duration-500 delay-150 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-gray-600 mb-6 transition-all duration-500 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {message}
          </p>

          <p
            className={`text-sm text-gray-500 mb-6 transition-all duration-500 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            You can view your booking details in your profile.
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
            <Link
              href="/"
              className="w-full text-center flex items-center text-nowrap justify-center gap-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-semibold"
            >
              <CgChevronDoubleLeft /> Back to home
            </Link>
            {showViewBookings && (
              <Link
                href="/profile"
                className="w-full text-center flex items-center text-nowrap justify-center gap-4 px-6 py-3 bg-[#013A8A] text-white rounded-lg hover:bg-[#013A8A]/90 transition-colors duration-200 font-semibold"
              >
                Show Booking List <CgChevronDoubleRight />
              </Link>
            )}
          </div>

          <div
            className={`w-24 h-1 bg-gradient-to-r from-[#013A8A] to-blue-300 rounded-full mt-2 ${
              isVisible ? "animate-pulse" : ""
            }`}
            style={{
              animationDuration: "2s",
              animationIterationCount: "infinite",
            }}
          ></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ThankYouModal;
