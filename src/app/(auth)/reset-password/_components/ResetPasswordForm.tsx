"use client";

import { resetPassword } from "@/api/auth";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SuccessModal from "./SuccessModal";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams?.get("email");
    const emailFromStorage = localStorage.getItem("reset_email");
    const tokenFromStorage = localStorage.getItem("reset_token");

    if (emailFromParams) {
      setEmail(emailFromParams);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    }

    if (tokenFromStorage) {
      setResetToken(tokenFromStorage);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Check if email and reset token are available
    if (!email) {
      setError("Email not found. Please restart the password reset process.");
      setIsLoading(false);
      return;
    }

    if (!resetToken) {
      setError(
        "Reset token not found. Please restart the password reset process."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword({
        email: email,
        new_password: password,
        new_password_confirmation: confirmPassword,
        reset_token: resetToken, // Include the reset token
      });

      if (response.status) {
        // Clear localStorage after successful reset
        localStorage.removeItem("reset_token");
        localStorage.removeItem("reset_email");
        setShowSuccessModal(true);
      } else {
        setError(
          response.message || "Failed to reset password. Please try again."
        );
      }
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mx-6 sm:mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                className="relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue-500 sm:text-sm"
                placeholder="Enter your new password (min. 8 characters)"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                className="relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue-500 sm:text-sm"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <div className="text-center"></div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-b from-blue via-[#0146a7] to-[#5a9cf7] hover:from-blue-600 hover:to-blue/90 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-blue hover:text-blue/90 text-sm font-medium transition-colors"
            >
              <span className="flex items-center justify-center gap-4">
                <HiArrowNarrowLeft />
                {"Back to Login"}
              </span>
            </Link>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
