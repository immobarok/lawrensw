"use client";

import { useEffect, useState } from "react";
import {
  getAllFooterTextAndLogo,
  getAllSocialLink,
  FooterData,
  SocialLink,
} from "@/api/footer/footer";
import { getDynamicPages, DynamicPage } from "@/api/dynamicpage/dynamicPage";
import FooterMain from "./FooterMain";

interface FooterWrapperProps {
  isHome: boolean;
}

export default function FooterWrapper({ isHome }: FooterWrapperProps) {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [dynamicPages, setDynamicPages] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        setLoading(true);

        const [footerDataResult, socialLinksResult, dynamicPagesResult] =
          await Promise.allSettled([
            getAllFooterTextAndLogo(),
            getAllSocialLink(),
            getDynamicPages(),
          ]);

        const footerData =
          footerDataResult.status === "fulfilled"
            ? footerDataResult.value
            : null;
        const socialLinks =
          socialLinksResult.status === "fulfilled"
            ? socialLinksResult.value
            : [];
        const dynamicPages =
          dynamicPagesResult.status === "fulfilled"
            ? dynamicPagesResult.value
            : [];

        setFooterData(footerData);
        setSocialLinks(socialLinks);
        setDynamicPages(dynamicPages);
      } catch (error) {
        console.error("🔥 Error fetching footer data:", error);
        setFooterData(null);
        setSocialLinks([]);
        setDynamicPages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  return (
    <FooterMain
      footerData={footerData}
      socialLinks={socialLinks}
      dynamicPages={dynamicPages}
      isHome={isHome}
      loading={loading}
    />
  );
}
