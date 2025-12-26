import { Suspense } from "react";
import Logo from "@/components/shared/Logo";
import ResetPasswordForm from "./_components/ResetPasswordForm";

const ResetPasswordLoadingFallback = () => (
  <div className="p-6 sm:p-8 space-y-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-12 bg-gray-200 rounded mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-12 bg-gray-200 rounded mb-6"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mt-6">
            <Logo />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below to reset your account password.
          </p>
        </div>
        {/* Form Component */}
        <Suspense fallback={<ResetPasswordLoadingFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
