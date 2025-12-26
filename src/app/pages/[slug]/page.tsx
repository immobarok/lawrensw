import { Metadata } from "next";
import parse from "html-react-parser";
import { getDynamicPageBySlug } from "@/api/dynamicpage/dynamicPage";
import { notFound } from "next/navigation";
import Image from "next/image";
import DataError from "@/components/shared/DataError";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  
  try {
    const page = await getDynamicPageBySlug(slug);
    
    if (!page) {
      notFound();
    }

    return {
      title: page.page_title,
      description: page.meta_description || `Content for ${page.page_title}`,
      openGraph: {
        title: page.page_title,
        description: page.meta_description || `Content for ${page.page_title}`,
        images: page.image ? [page.image] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching metadata for page:", error);
    return {
      title: "Error",
      description: "Error loading page content",
    };
  }
}

export default async function DynamicPageComponent({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  let page;
  let error: string | null = null;

  try {
    page = await getDynamicPageBySlug(slug);

    if (!page || !page.page_title) {
      console.log("Page not found or invalid data for slug:", slug);
      notFound();
    }
  } catch (err) {
    console.error("Error fetching page:", err);
    error = "Unable to load page content. Please try again later.";
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DataError message={error} />
      </div>
    );
  }

  const hasContent = page?.page_content
    ? page.page_content.trim().length > 0
    : false;

  const fallbackData = {
    page_header: page?.page_header || page?.page_title || "Untitled Header",
    page_title: page?.page_title || "Untitled Page",
    image: page?.image || "/placeholder.png",
    page_content: page?.page_content || "",
  };

  return (
    <div className="relative ">
      <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex flex-col items-start justify-center text-white text-start overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={fallbackData.image}
            alt={fallbackData.page_title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-dark/40 bg-blend-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container max-w-8xl mx-auto p-4 md:p-0 mt-20 md:mt-28">
          <div className="text-black">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.2] md:leading-[1.3] p-4 md:p-0">
              {fallbackData.page_header}
            </h1>

            {page?.page_title && (
              <p className="text-lg sm:text-xl md:text-2xl max-w-full md:max-w-3xl leading-relaxed">
                {page?.page_title}
              </p>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[80px] md:h-[100px] lg:h-[120px] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none z-10"></div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-0">
          <div className="bg-white rounded-2xl -mt-20 relative z-20">
            {hasContent ? (
              <div className="prose prose-lg max-w-none w-full text-gray-800">
                {parse(fallbackData.page_content)}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📄</span>
                </div>
                <p className="text-gray-500 text-lg">
                  No content available for this page.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}