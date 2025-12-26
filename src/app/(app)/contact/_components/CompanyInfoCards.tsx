// app/contact/_components/CompanyInfoCards.tsx
import Image from "next/image";
import { Company } from "@/api/contact/contact";
import { BiMailSend, BiPhone } from "react-icons/bi";
import { assets } from "../../../../../public/assets/assets";

interface CompanyInfoCardsProps {
  companyInfo: Company | null;
}

// Fallback company data
const FALLBACK_COMPANY_INFO = {
  company_address: "Hallehuis 15, 9932CC Delfzijl, The Netherlands",
  phone: "+31 653167490",
  email: "info@polartraveler.com",
  opening_hours: "Monday to Friday: 6 - 12 AM (EDT) 9 AM - 5 PM (CEST)",
};

const CompanyInfoCards = ({ companyInfo }: CompanyInfoCardsProps) => {
  const info = companyInfo || FALLBACK_COMPANY_INFO;
  const addressLines = info.company_address
    .split(",")
    .map((line) => line.trim());

  const formatOpeningHours = (hours: string) => {
    const parts = hours.split(":");
    if (parts.length >= 2) {
      const dayPart = parts[0].trim(); // "Monday to Friday"
      const timePart = parts[1].trim(); // "6 - 12 AM (EDT)9 AM - 5 PM (CEST)"

      // Split time part to separate EDT and CEST times
      const timeMatch = timePart.match(/(.+?)\(EDT\)(.+?)\(CEST\)/);
      if (timeMatch) {
        const edtTime = timeMatch[1].trim(); // "6 - 12 AM "
        const cestTime = timeMatch[2].trim(); // "9 AM - 5 PM "

        return (
          <div>
            <div>{dayPart}:</div>
            <div>{edtTime}(EDT)</div>
            <div>{cestTime}(CEST)</div>
          </div>
        );
      }
    }
    // Fallback to original text if parsing fails
    return <div>{hours}</div>;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Location Card */}
      <div className="bg-white text-start text-black py-6 px-5 rounded-lg border border-gray-200">
        <Image src={assets.mapIcon} width={52} height={52} alt="Location" />
        <div className="mt-4 space-y-1.5">
          <h1 className="font-semibold text-xl">Where we are based</h1>
          <div className="text-gray-600">
            {addressLines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-white text-start text-black py-6 px-5 rounded-lg border border-gray-200">
        <Image src={assets.phoneIcon} width={52} height={52} alt="Contact" />
        <div className="mt-4 space-y-1.5">
          <h1 className="font-semibold text-xl">How to contact us</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <BiPhone className="text-lg" />
            <span>{info.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <BiMailSend className="text-lg" />
            <span>{info.email}</span>
          </div>
        </div>
      </div>

      {/* Hours Card */}
      <div className="bg-white text-start text-black py-6 px-5 rounded-lg border border-gray-200">
        <Image src={assets.mailIcon} width={52} height={52} alt="Hours" />
        <div className="mt-4 space-y-1.5">
          <h1 className="font-semibold text-xl">Opening hours</h1>
          <div className="text-gray-600">
            {formatOpeningHours(info.opening_hours)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCards;
