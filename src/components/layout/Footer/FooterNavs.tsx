import Image from "next/image";
import Link from "next/link";
import { DynamicPage } from "@/api/dynamicpage/dynamicPage";
import { FooterData, SocialLink } from "@/api/footer/footer";
import Logo from "@/components/shared/Logo";
import { useTranslation } from "@/hook/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";

interface FooterNavsProps {
  footerData: FooterData | null;
  socialLinks: SocialLink[];
  dynamicPages: DynamicPage[];
}

const FooterNavs = ({
  footerData,
  socialLinks,
  dynamicPages,
}: FooterNavsProps) => {
  // Translation hooks for all static texts
  const { text: exploreText } = useTranslation("Explore");
  const { text: homeText } = useTranslation("Home");
  const { text: allTripsText } = useTranslation("All Trips");
  const { text: aboutUsText } = useTranslation("About Us");
  const { text: contactText } = useTranslation("Contact");
  const { text: faqText } = useTranslation("FAQ");
  const { text: termsText } = useTranslation("Terms & Conditions");
  const { text: contentMenuText } = useTranslation("Content & Menu");
  const { text: noPagesText } = useTranslation("No pages available");
  const { text: contactHeaderText } = useTranslation("Contact");
  const { text: locationText } = useTranslation("Utrecht, Netherlands");

  const { currentLanguage } = useLanguage();
  const searchParams = useSearchParams();

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-0 pb-6">
        <div className="flex flex-col gap-6">
          <Logo />
          <p className="text-heading-dark text-[16px] md:text-[20px]">
            {footerData?.tag_line}
          </p>
          <div className="grid grid-cols-5 space-y-4 w-[85%]">
            {socialLinks
              .filter((social) => social.status === "active")
              .map((social) => (
                <Link
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-color"
                >
                  <Image
                    src={social.icon}
                    width={24}
                    height={24}
                    alt={social.name}
                    className="object-contain rounded-full h-auto w-8"
                  />
                </Link>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-[#012962] text-[18px] md:text-[20px] mb-4 md:mb-6">
            {exploreText}
          </h2>
          <ul className="text-[16px] md:text-[20px] text-blue space-y-2 list-none flex flex-col gap-3 md:gap-6">
            <li>
              <Link href="/" className="hover:text-blue-700 transition-colors">
                {homeText}
              </Link>
            </li>
            <li>
              <Link
                href="/allNatureTrips"
                className="hover:text-blue-700 transition-colors"
              >
                {allTripsText}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-blue-700 transition-colors"
              >
                {aboutUsText}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-700 transition-colors"
              >
                {contactText}
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-blue-700 transition-colors"
              >
                {faqText}
              </Link>
            </li>
            <li>
              <Link
                href="/termsAndConditions"
                className="hover:text-blue-700 transition-colors"
              >
                {termsText}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[#012962] text-[18px] md:text-[20px] mb-4 md:mb-6">
            {contentMenuText}
          </h2>
          <ul className="text-[16px] md:text-[20px] text-blue space-y-2 list-none flex flex-col gap-3 md:gap-6">
            {dynamicPages.length > 0 ? (
              dynamicPages.map((page) =>
                page.page_slug &&
                typeof page.page_slug === "string" &&
                page.page_slug.trim().length > 0 ? (
                  <li key={page.id}>
                    <a
                      href={`/pages/${page.page_slug}?lang=${currentLanguage.code}`}
                      className="hover:text-blue-700 transition-colors"
                      data-no-translate
                      rel="noopener noreferrer"
                      target="_self"
                    >
                      <span data-no-translate>{page.page_title}</span>
                    </a>
                  </li>
                ) : null
              )
            ) : (
              <li className="text-gray-500">{noPagesText}</li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-[#012962] text-[18px] md:text-[20px] mb-4 md:mb-6">
            {contactHeaderText}
          </h2>
          <ul className="text-[16px] md:text-[20px] text-blue space-y-2 list-none flex flex-col gap-3 md:gap-6">
            <li className="hover:text-blue-700 transition-colors">
              {locationText}
            </li>
            <li>
              <a
                href={`mailto:${footerData?.email || "info@polar.traveler.nl"}`}
                className="hover:text-blue-700 transition-colors"
              >
                {footerData?.email || "info@polar.traveler.nl"}
              </a>
            </li>
            <li>
              <a
                href={`tel:${footerData?.phone_code || ""}${
                  footerData?.phone_number || "31612345678"
                }`}
                className="hover:text-blue-700 transition-colors"
              >
                {footerData?.phone_code && footerData.phone_number
                  ? `${footerData.phone_code} ${footerData.phone_number}`
                  : "+31 61234 5678"}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-[#B0C2DB] border-0 rounded-sm my-6"></hr>
    </div>
  );
};

export default FooterNavs;
