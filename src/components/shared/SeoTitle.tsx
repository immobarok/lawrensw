import { getAllSeoTitle } from "@/api/seo/seoTitle";
import DataError from "./DataError";
import Head from "next/head";
import React from "react";

interface SeoTitleData {
  id: number;
  title: string;
  description: string;
}

const SeoTitle = async () => {
  try {
    const response = await getAllSeoTitle();

    let seoTitles: SeoTitleData[] = [];

    if (response.success && response.data) {
      const data = response.data as unknown;
      if (Array.isArray(data)) {
        seoTitles = data as SeoTitleData[];
      } else if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as Record<string, unknown>).data)
      ) {
        seoTitles = (data as { data: SeoTitleData[] }).data;
      } else {
        throw new Error("Unexpected data structure");
      }
    } else {
      throw new Error("Failed to fetch SEO titles");
    }

    return (
      <div className="container mx-auto pb-28">
        <Head>
          {seoTitles.map((item) => (
            <React.Fragment key={item.id}>
              <meta name="description" content={item.description} />
              <meta name="title" content={item.title} />
              <title>{item.title}</title>
            </React.Fragment>
          ))}
        </Head>

        <div className="px-4">
          <div className="grid grid-cols-1 gap-10">
            {seoTitles.map((item, index) => (
              <div key={item.id} className="relative group">
                <div className="absolute -inset-2 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-blue text-3xl font-bold mb-2">
                    0{index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {seoTitles.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No SEO content available at the moment.
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("API Error:", err);

    return (
      <div className="container mx-auto pb-28">
        <DataError />
      </div>
    );
  }
};

export default SeoTitle;
