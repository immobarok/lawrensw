import Loader from "@/components/shared/Loader";
import AboutHeroSection from "./_components/AboutHeroSection";
import CTASection from "./_components/CTASection";
import DestinationsSection from "./_components/DestinationWeCover";
import OurMissionSection from "./_components/OurMisssion";
import OurStory from "./_components/OurStory";
import ResponsibleTravel from "./_components/ResponsibleTravel";
import TeamSection from "./_components/TeamSection";
import WhatMakesUsDifferent from "./_components/WhatMakesDiff";
import { Suspense } from "react";
import { getAboutPageMetaData } from "@/api/pagemeta/pagemeta";
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

  // Determine language preference
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

  const meta = await getAboutPageMetaData(language);
  return {
    title: meta.title,
    description: meta.description,
  };
}

const Page = () => {
  return (
    <div>
      <AboutHeroSection />
      <OurMissionSection />
      <WhatMakesUsDifferent />
      <Suspense fallback={<Loader message="Loading story" />}>
        <OurStory />
      </Suspense>
      <Suspense
        fallback={
          <div className="bg-white py-16 px-4 sm:px-6">
            <div className="container mx-auto">
              <div className="text-start mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Destinations We Cover
                </h2>
                <p className="text-gray-800 text-lg">
                  Nature-rich travel across continents, always guided by
                  purpose.
                </p>
              </div>
              <Loader message="Loading destinations..." />
            </div>
          </div>
        }
      >
        <DestinationsSection />
      </Suspense>
      <Suspense
        fallback={
          <div className="bg-[#F4F6F8] py-16 px-4 sm:px-6">
            <div className="container mx-auto">
              <Loader message="Loading responsible travel information..." />
            </div>
          </div>
        }
      >
        <ResponsibleTravel />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <TeamSection />
      </Suspense>
      <CTASection />
    </div>
  );
};

export default Page;
