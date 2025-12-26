// app/auth/verify-otp/page.tsx
import Logo from "@/components/shared/Logo";
import Link from "next/link";
import VerifyOTPForm from "./_components/VerifyOtpForm";

interface VerifyOTPPageProps {
  searchParams: {
    email?: string;
    error?: string;
    success?: string;
  };
}

export default function VerifyOTPPage({ searchParams }: VerifyOTPPageProps) {
  const email = searchParams.email
    ? decodeURIComponent(searchParams.email)
    : "";

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center pt-8 px-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
            Verify OTP
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit verification code sent to{" "}
            <span className="font-medium text-blue">{email}</span>
          </p>
        </div>

        {/* OTP Form - Client Component */}
        <VerifyOTPForm email={email} searchParams={searchParams} />

        {/* Additional Help */}
        <div className="text-center pb-6 px-6">
          <p className="text-xs text-gray-500">
            Didn&apos;t receive the code?{" "}
            <Link
              href={`/forgot-password?email=${encodeURIComponent(email)}`}
              className="text-blue hover:text-blue-700 font-medium"
            >
              Resend OTP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
