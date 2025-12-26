"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyOTP } from "@/api/auth";
import { HiArrowNarrowLeft } from "react-icons/hi";

interface VerifyOTPFormProps {
  email: string;
  searchParams: {
    error?: string;
    success?: string;
  };
}


export default function VerifyOTPForm({
  email,
  searchParams,
}: VerifyOTPFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(searchParams.error || "");
  const [success, setSuccess] = useState(searchParams.success || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) value = value.slice(0, 1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    if (pastedNumbers.length === 6) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);

      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyOTP(email, otpCode);

      if (response.status) {
        if ("reset_token" in response && response.reset_token) {
          setSuccess(response.message || "OTP verified successfully!");
          localStorage.setItem("reset_token", response.reset_token);
          localStorage.setItem("reset_email", email);
          setTimeout(() => {
            router.push("/reset-password");
          }, 1000);
        } else {
          setError("Reset token not received. Please try again.");
        }
      } else {
        setError(response.message || "Invalid OTP code. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to verify OTP. Please try again.");
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.join("").length === 6;

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
      {/* OTP Input Boxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Verification Code
        </label>
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue-200 transition-colors text-blue"
              required
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isOtpComplete || isLoading}
        className="group relative w-full flex justify-center py-3 px-4 border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-b from-blue via-[#0146a7] to-[#5a9cf7] hover:from-blue-600 hover:to-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Verifying...
          </span>
        ) : (
          "Verify OTP"
        )}
      </button>

      {/* Back to Forgot Password Link */}
      <div className="text-center">
        <Link
          href="/auth/forgot-password"
          className="text-blue hover:text-blue/90 text-sm font-medium transition-colors"
        >
          <span className="flex items-center justify-center gap-4">
            <HiArrowNarrowLeft />
            {"Use different email"}
          </span>
        </Link>
      </div>
    </form>
  );
}
