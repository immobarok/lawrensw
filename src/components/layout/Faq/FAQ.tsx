import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Link from "next/link";
import { getAllFAQItems } from "@/api/faq/faq";
import FAQItems from "./FAQItems";

interface Faq {
  id: number;
  que: string;
  ans: string;
  status: string;
}

interface FAQProps {
  isHomePage?: boolean;
}

const FAQ = async ({ isHomePage }: FAQProps) => {
  let faqs: Faq[] = [];
  let error: string | null = null;

  try {
    const response = await getAllFAQItems();

    // Check if the fetch request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log("FAQ response:", data);

    // Handle the nested response structure {status, message, data, code}
    if (data.status && data.data && Array.isArray(data.data)) {
      const activeFaqs = data.data.filter(
        (faq: Faq) => faq.status === "active"
      );
      faqs = activeFaqs;
    } else {
      console.warn("Failed to fetch FAQs or unexpected data structure:", data);
    }
  } catch (err) {
    console.error("FAQ fetch error:", err);
    // Don't show error to user for 404s, handle gracefully
    if (!(err instanceof Error) || !err.message.includes("404")) {
      error =
        "We're experiencing technical difficulties. Please try again later.";
    }
  }

  const isHome = isHomePage !== undefined ? isHomePage : false;

  return (
    <Section>
      <SectionTitle
        title="Frequently Asked Questions"
        description="Answers to common questions about our tours, travel, and bookings."
      />

      {/* Show error state if there's an error */}
      {error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-red-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Temporary Service Issue
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-12 ">
          <div className=" rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No FAQs Available
            </h3>
            <p className="text-gray-600 mb-4">
              We&apos;re currently updating our frequently asked questions.
              Please check back soon.
            </p>
          </div>
        </div>
      ) : (
        // Show FAQs if available
        <>
          <FAQItems faqs={faqs} isHome={isHome} />

          {/* Final CTA - Only show on non-home pages */}
          {!isHome && (
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl text-black font-bold mb-6">
                Didn&apos;t find your answer?
              </h3>
              <Link
                href={"/contact"}
                className="py-3 rounded-lg px-20 text-lg font-medium text-white bg-secondary hover:bg-secondary-dark transition-colors"
              >
                Contact Us
              </Link>
            </div>
          )}
        </>
      )}
    </Section>
  );
};

export default FAQ;
