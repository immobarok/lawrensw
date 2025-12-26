"use client";

import { useState } from "react";

interface Faq {
  id: number;
  que: string;
  ans: string;
  status: string;
}

interface FAQItemsProps {
  faqs: Faq[];
  isHome: boolean;
}

const FAQItems = ({ faqs, isHome }: FAQItemsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  //console.log("Home",isHome);

  const renderAnswer = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <div
      className={`flex flex-col items-center justify-center mb-14 px-4 container mx-auto ${
        isHome ? "" : "space-y-4"
      }`}
    >
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          className={`cursor-pointer w-full py-6 first:pt-6 rounded-lg p-6 ${
            isHome
              ? "bg-none shadow-none border-b border-gray-200 last:border-b-0"
              : "bg-white shadow-sm mb-4"
          }`}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        >
          {/* Question */}
          <div className="flex items-center justify-between">
            <h3
              className={`text-lg sm:text-xl md:text-2xl font-medium ${
                isHome ? "text-heading-dark" : "text-heading-dark"
              }`}
            >
              {faq.que}
            </h3>
            {openIndex === index ? (
              // Minus icon when FAQ is open
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={isHome ? "text-heading-dark" : "text-heading-dark"}
              >
                <path
                  d="M4.5 9H13.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              // Plus icon when FAQ is closed
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={isHome ? "text-heading-dark" : "text-heading-dark"}
              >
                <path
                  d="M9 4.5V13.5M4.5 9H13.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {/* Answer */}
          <div
            className={`overflow-hidden text-sm sm:text-lg md:text-xl text-gray-700 transition-all duration-500 ease-in-out ${
              openIndex === index
                ? "opacity-100 max-h-96 pt-4 mt-2"
                : "opacity-0 max-h-0 pt-0 mt-0"
            } ${isHome ? "" : "border-t border-gray-200"}`}
          >
            <div
              className="prose prose-sm sm:prose-lg max-w-none"
              dangerouslySetInnerHTML={renderAnswer(faq.ans)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQItems;
