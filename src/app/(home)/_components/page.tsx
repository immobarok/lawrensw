import ReviewMain from "@/components/layout/Review/ReviewMain";
import Gallary from "./Gallary";
import Hero from "./Hero";
import PopularTour from "./PopularTour";
import WhyTravelUs from "./WhyTravelWithUs";
import FAQ from "@/components/layout/Faq/FAQ";
import Loader from "@/components/shared/Loader";
import { Suspense } from "react";
import { getHomePageMetaData } from "@/api/pagemeta/pagemeta";
import { headers, cookies } from "next/headers";

export async function generateMetadata() {
  const headersList = await headers();
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get("language")?.value;
  const langCookie = cookieStore.get("lang")?.value;
  const localeCookie = cookieStore.get("locale")?.value;

  const testLangCookie = cookieStore.get("test-language")?.value;
  const getLanguageName = (code: string) => {
    switch (code?.toLowerCase()) {
      case "nl":
      case "dutch":
        return "Dutch";
      case "en":
      case "english":
      default:
        return "English";
    }
  };
  let language = "English"; 
  let detectionMethod = "default";

  if (testLangCookie) {
    language = getLanguageName(testLangCookie);
    detectionMethod = "test override";
  } else if (languageCookie) {
    language = getLanguageName(languageCookie);
    detectionMethod = "language cookie";
  } else if (langCookie) {
    language = getLanguageName(langCookie);
    detectionMethod = "lang cookie";
  } else if (localeCookie) {
    language = getLanguageName(localeCookie);
    detectionMethod = "locale cookie";
  } else {
    const acceptLanguage = headersList.get("accept-language");
    //console.log("Accept-Language header:", acceptLanguage);
    if (
      acceptLanguage &&
      (acceptLanguage.includes("nl") || acceptLanguage.includes("dutch"))
    ) {
      language = "Dutch";
      detectionMethod = "accept-language header";
    }
  }

  //console.log(`🌐 Detected language: ${language} (via ${detectionMethod})`);

  const meta = await getHomePageMetaData(language);
  //console.log("📝 Meta data returned:", meta);

  return {
    title: meta.title,
    description: meta.description,
  };
}

const Home = () => {
  return (
    <div>
      <Hero />
      <div className="bg-dark">
        <PopularTour />
      </div>
      <WhyTravelUs />
      <div className="bg-dark">
        <Gallary />
      </div>
      <div className="bg-[#F4F6F8]">
        <Suspense fallback={<Loader />}>
          <ReviewMain />
        </Suspense>
      </div>
      <div className="bg-[#E6EBF3]">
        <FAQ isHomePage={true} />
      </div>
    </div>
  );
};
export default Home;
