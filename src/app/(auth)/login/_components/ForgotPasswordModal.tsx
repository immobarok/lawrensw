"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/shared/Logo";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess("OTP sent successfully! Check your email.");
        router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
        setEmail("");
        setTimeout(() => onClose(), 1500);
      } else {
        const data = await response.json();
        setError(data?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 sm:p-8 relative animate-slide-in"
      >
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your email address below. We’ll send you a link to reset your
          password.
        </p>
        <div className="space-y-4">
          <label className="text-gray-800">E-mail Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-3 font-medium w-full bg-gradient-to-b from-blue via-[#0146a7] to-[#5a9cf7] text-white rounded-lg hover:bg-blue disabled:bg-blue-400 transition"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
