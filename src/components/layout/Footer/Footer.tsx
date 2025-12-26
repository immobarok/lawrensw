import { getAllFooterTextAndLogo, getAllSocialLink } from "@/api/footer/footer";
import { getDynamicPages } from "@/api/dynamicpage/dynamicPage";
import FooterMain from "./FooterMain";
import { unstable_cache } from "next/cache";

const getCachedFooterData = unstable_cache(
  async () => {
    try {
      const [footerDataResult, socialLinksResult, dynamicPagesResult] =
        await Promise.allSettled([
          getAllFooterTextAndLogo(),
          getAllSocialLink(),
          getDynamicPages(),
        ]);

      const footerData =
        footerDataResult.status === "fulfilled" ? footerDataResult.value : null;
      const socialLinks =
        socialLinksResult.status === "fulfilled" ? socialLinksResult.value : [];
      const dynamicPages =
        dynamicPagesResult.status === "fulfilled"
          ? dynamicPagesResult.value
          : [];
      return {
        footerData,
        socialLinks,
        dynamicPages,
      };
    } catch (error) {
      console.error("🔥 Error in getFooterData function:", error);
      return {
        footerData: null,
        socialLinks: [],
        dynamicPages: [],
      };
    }
  },
  ["footer-data"],
  { revalidate: 3600 } 
);

export async function getFooterData() {
  return getCachedFooterData();
}

export default async function Footer({ isHome }: { isHome: boolean }) {
  const { footerData, socialLinks, dynamicPages } = await getFooterData();

  return (
    <FooterMain
      footerData={footerData}
      socialLinks={socialLinks}
      dynamicPages={dynamicPages}
      isHome={isHome}
    />
  );
}
