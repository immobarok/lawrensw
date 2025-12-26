"use client";
import Link from "next/link";
import { BiHome, BiMailSend, BiSearch } from "react-icons/bi";
import { CgArrowLeft } from "react-icons/cg";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [particles, setParticles] = useState<
    Array<{
      top: number;
      left: number;
      animationDuration: number;
      animationDelay: number;
    }>
  >([]);

  useEffect(() => {
    const newParticles = [...Array(20)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDuration: 3 + Math.random() * 4,
      animationDelay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-[#013A8A] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-[#013A8A] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#013A8A] opacity-3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-8">
            <div className="relative inline-block">
              <span className="text-9xl font-bold text-[#013A8A] opacity-90 relative">
                4
                <span className="absolute inset-0 text-[#013A8A] opacity-20 animate-pulse">
                  4
                </span>
              </span>
              <span className="text-9xl font-bold text-[#013A8A] opacity-90 relative mx-4">
                0
                <span className="absolute inset-0 text-[#013A8A] opacity-20 animate-pulse delay-75">
                  0
                </span>
              </span>
              <span className="text-9xl font-bold text-[#013A8A] opacity-90 relative">
                4
                <span className="absolute inset-0 text-[#013A8A] opacity-20 animate-pulse delay-150">
                  4
                </span>
              </span>
            </div>
          </div>

          {/* Floating Icon */}
          <div className="mb-8 animate-pulse">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#013A8A] to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <BiSearch className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into
              the digital wilderness. Let's get you back on track.
            </p>
          </div>

          {/* Action bottons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-[#013A8A] hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Link href="/" className="flex items-center gap-2">
                <BiHome className="h-5 w-5" />
                Go Home
              </Link>
            </button>

            <button
              className=" text-[#013A8A] text-nowrap flex border gap-2 items-center border-[#013A8A] hover:bg-[#013A8A] hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => window.history.back()}
            >
              <CgArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-blue-100 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <BiMailSend className="h-6 w-6 text-[#013A8A] mr-2" />
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Can't find what you're looking for? Contact our support team.
            </p>
            <button className="text-[#013A8A] hover:text-blue-800 hover:bg-blue-50">
              <Link href="/contact" className="text-sm font-medium">
                Contact Support →
              </Link>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#013A8A] opacity-20 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#013A8A] opacity-10 rounded-full"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animation: `float ${particle.animationDuration}s infinite ease-in-out`,
                animationDelay: `${particle.animationDelay}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

// Optional: You can also create a more minimalist version
export function MinimalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-[#013A8A] ">404</div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#013A8A] to-blue-300 mx-auto mb-6"></div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="space-x-4">
          <button className="bg-[#013A8A] hover:bg-blue-800 text-white">
            <Link href="/">Return Home</Link>
          </button>
          <button
            className="border-[#013A8A] text-[#013A8A]"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
