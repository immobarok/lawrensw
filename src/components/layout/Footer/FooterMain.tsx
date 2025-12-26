import Section from "@/components/ui/Section";
import FooterCopyright from "./FooterCopyright";
import FooterNavs from "./FooterNavs";
import FooterSubscribe from "./FooterSubscribe";
import { FooterData, SocialLink } from "@/api/footer/footer";
import { DynamicPage } from "@/api/dynamicpage/dynamicPage";

interface FooterMainProps {
  footerData: FooterData | null;
  socialLinks: SocialLink[];
  dynamicPages: DynamicPage[];
  isHome: boolean;
  loading?: boolean;
}

function isValidFooterData(data: unknown): data is FooterData {
  return typeof data === "object" && data !== null && "id" in data && typeof (data as FooterData).id === "number";
}

export default function FooterMain({
  footerData,
  socialLinks,
  dynamicPages,
  isHome,
  loading = false, 
}: FooterMainProps) {
  const backgroundImage = isHome ? "url('/footer.png')" : "url('/footer2.png')";
  const hasValidFooterData = isValidFooterData(footerData);

  return (
    <footer
      className="pb-4 bg-cover bg-center mx-auto"
      style={{
        backgroundImage,
        backgroundColor: "#E6EBF3",
      }}
      aria-label="Site Footer"
    >
      <Section className="pb-0 p-4">
        {isHome && <FooterSubscribe />}

        {loading ? (
          // You can replace this with a spinner or skeleton component
          <div className="text-gray-400 font-medium text-center py-4 animate-pulse">
            Loading footer content...
          </div>
        ) : !hasValidFooterData ? (
          <div
            className="text-gray-800 font-medium text-center py-4"
            role="status"
          >
            Could not load footer content.
          </div>
        ) : (
          <>
            <FooterNavs
              footerData={footerData}
              socialLinks={socialLinks}
              dynamicPages={dynamicPages}
            />
            <FooterCopyright footerData={footerData} loading={loading} />
          </>
        )}
      </Section>
    </footer>
  );
}
