// components/layout/Footer/FooterCopyright.tsx
interface FooterData {
  copyright_text?: string;
}

interface FooterCopyrightProps {
  footerData: FooterData;
  loading: boolean;
}

export default function FooterCopyright({
  footerData,
  loading,
}: FooterCopyrightProps) {
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row justify-center items-center pt-6">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-2 md:mb-0"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center pt-6">
      <p className="text-[#012962] text-[16px] md:text-[18px]">
        {footerData?.copyright_text ||
          `© ${currentYear} Company. All Rights Reserved.`}
      </p>
    </div>
  );
}
