"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { assets } from "../../../../../public/assets/assets";

// Dynamic import of server component Logo with no SSR
const Logo = dynamic(() => import("@/components/shared/Logo"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <div className="animate-pulse flex items-center space-x-2">
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
});

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative max-w-2xl w-full bg-white rounded-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mt-6">
            <Logo />
          </div>
          <div className="mt-6">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Image
                src={assets.resetModalIcon}
                alt="Success"
                width={64}
                height={64}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Password Reset Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 sm:p-8 space-y-6">
          <div className="text-center">
            <p className="text-gray-700">
              🎉 Great! Your account is now secure with your new password.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="group relative w-full flex justify-center py-3 px-4 border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-b from-blue via-[#0146a7] to-[#5a9cf7] hover:from-blue-600 hover:to-blue/90 cursor-pointer transition-colors"
            >
              Go to Login
            </Link>

            <button
              onClick={handleClose}
              className="w-full py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
