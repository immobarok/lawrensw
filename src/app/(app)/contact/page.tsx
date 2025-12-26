import FAQ from "@/components/layout/Faq/FAQ";
import ContactForm from "./_components/ContactForm";
import Hero from "./_components/Hero";
import { getContactPageMetaData } from "@/api/pagemeta/pagemeta";
import { getCompanyInfo } from "@/api/contact/contact";
import CompanyInfoCards from "./_components/CompanyInfoCards";
import { headers, cookies } from "next/headers";

export async function generateMetadata() {
  const headersList = await headers();
  const cookieStore = await cookies();

  const languageCookie = cookieStore.get("language")?.value;
  const getLanguageName = (code: string) => {
    switch (code) {
      case "nl":
        return "Dutch";
      case "en":
      default:
        return "English";
    }
  };

  let language = "English"; // default

  if (languageCookie) {
    language = getLanguageName(languageCookie);
  } else {
    // Fallback to Accept-Language header
    const acceptLanguage = headersList.get("accept-language");
    if (acceptLanguage && acceptLanguage.includes("nl")) {
      language = "Dutch";
    }
  }

  const meta = await getContactPageMetaData(language);
  return {
    title: meta.title,
    description: meta.description,
  };
}

const Page = async () => {
  let companyInfo = null;
  try {
    const companies = await getCompanyInfo();
    companyInfo = companies.length > 0 ? companies[0] : null;
  } catch (error) {
    console.error("Failed to fetch company info:", error);
  }

  return (
    <div>
      <Hero />
      <div className="bg-gradient-to-b from-white to-dark py-12">
        {/* Contact Section with Form and Company Info */}
        <div className="px-4 md:px-0 container mx-auto -mt-24 md:mt-5 lg:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-[70%_28%] gap-8">
            <ContactForm />
            <CompanyInfoCards companyInfo={companyInfo} />
          </div>
        </div>
      </div>
      <div className="bg-dark md:pt-12">
        <FAQ isHomePage={false} />
      </div>
    </div>
  );
};

export default Page;
