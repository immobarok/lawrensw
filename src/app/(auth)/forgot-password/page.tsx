import Image from "next/image";
import { getLogoAndFavicon } from "@/api/logo/logo";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  // Fetch logo data on the server
  let logoSrc = "/images/Frame 704.png"; // Fallback logo

  try {
    const logoData = await getLogoAndFavicon();
    if (logoData?.logo) {
      logoSrc = logoData.logo;
    }
  } catch (error) {
    console.error("Failed to fetch logo:", error);
    // Will use fallback logo
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mt-6">
            <Image
              src={logoSrc}
              className="w-36 md:w-82 h-auto"
              width={295}
              height={64}
              alt="logo"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a one-time<br></br>{" "}
            password (OTP) to reset your password.
          </p>
        </div>
        <ForgotPasswordForm searchParams={searchParams} />
      </div>
    </div>
  );
}
