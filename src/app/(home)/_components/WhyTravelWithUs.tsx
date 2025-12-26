import SectionTitle from "@/components/ui/SectionTitle";
import { FaCheck } from "react-icons/fa";
import { PiUsersThree } from "react-icons/pi";
import Section from "./../../../components/ui/Section";
import {
  getAllInclusive,
  getAllPremiumServices,
  getAdvisorList,
} from "@/api/home/home";
import TravelAdvisor from "@/components/shared/TravelAdvisor";

interface InclusiveItem {
  id: number;
  header: string;
  title: string;
  description1: string;
  description2: string;
  description3: string;
  description4: string;
}

interface PremiumService {
  id: number;
  header: string;
  title: string;
  description1: string;
  description2: string;
  description3: string;
  description4: string;
}

interface TravelAdvisorData {
  id: number;
  name: string;
  designation: string;
  experience: string;
  trip_success: string;
  whatsapp: string;
  image: string;
}

const extractData = async (apiResponse: any): Promise<unknown> => {
  try {
    // If the response has a 'json' method (like fetch Response), use it
    if (apiResponse && typeof apiResponse.json === "function") {
      const data = await apiResponse.json();
      if (!data) return null;
      if (data && typeof data === "object" && "data" in data) {
        const responseData = (data as { data: unknown }).data;
        if (
          responseData &&
          typeof responseData === "object" &&
          "data" in responseData
        ) {
          return (responseData as { data: unknown }).data;
        }
        if (Array.isArray(responseData)) {
          return responseData;
        }
        if (responseData && typeof responseData === "object") {
          return responseData;
        }
      }
      if (Array.isArray(data)) {
        return data;
      }
      if (data && typeof data === "object" && "data" in data) {
        return (data as { data: unknown }).data || data;
      }
      return data;
    }
    // If the response is already a parsed object (like ApiResponse), use it directly
    if (apiResponse && typeof apiResponse === "object" && "data" in apiResponse) {
      const responseData = apiResponse.data;
      if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData
      ) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }
      if (responseData && typeof responseData === "object") {
        return responseData;
      }
    }
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }
    return apiResponse;
  } catch (error) {
    console.error("Error extracting data:", error);
    return null;
  }
};

const WhyTravelUs = async () => {
  let allInclusiveData: InclusiveItem | null = null;
  let premiumServiceData: PremiumService | null = null;
  let travelAdvisor: TravelAdvisorData | null = null;
  let error: string | null = null;

  try {
    const [inclusiveRes, premiumRes, advisorRes] = await Promise.all([
      getAllInclusive(),
      getAllPremiumServices(),
      getAdvisorList(),
    ]);

    const inclusiveResult = await extractData(inclusiveRes);
    if (
      inclusiveResult &&
      Array.isArray(inclusiveResult) &&
      inclusiveResult.length > 0
    ) {
      allInclusiveData = inclusiveResult[0] as InclusiveItem;
    } else if (
      inclusiveResult &&
      typeof inclusiveResult === "object" &&
      !Array.isArray(inclusiveResult)
    ) {
      allInclusiveData = inclusiveResult as InclusiveItem;
    }

    const premiumResult = await extractData(premiumRes);
    if (
      premiumResult &&
      Array.isArray(premiumResult) &&
      premiumResult.length > 0
    ) {
      premiumServiceData = premiumResult[0] as PremiumService;
    } else if (premiumResult && typeof premiumResult === "object") {
      premiumServiceData = premiumResult as PremiumService;
    }

    const advisorResult = await extractData(advisorRes);
    if (
      advisorResult &&
      Array.isArray(advisorResult) &&
      advisorResult.length > 0
    ) {
      travelAdvisor = advisorResult[0] as TravelAdvisorData;
    } else if (advisorResult && typeof advisorResult === "object") {
      travelAdvisor = advisorResult as TravelAdvisorData;
    }
  } catch (err) {
    error = "An error occurred while fetching data";
    console.error("API Error:", err);
  }

  return (
    <div className="bg-bg-light">
      <Section>
        <SectionTitle
          title="Why travel with us"
          description="Experience the difference that personalized service and expert knowledge makes."
        />

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">NO DATA FOUND !!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          <div className="lg:col-span-2 space-y-6">
            {/* Premium Services Card */}
            <div className="bg-dark rounded-2xl p-6 shadow-sm">
              <div className="flex flex-row items-start gap-4 ">
                <div className="bg-white w-16 h-16 p-4 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 21C3.79086 21 2 19.2091 2 17V16C2 15.4477 2.46 15.0163 2.98189 14.8356C4.15653 14.4289 5 13.313 5 12C5 10.687 4.15653 9.57105 2.98189 9.16437C2.46 8.98368 2 8.55228 2 8V7C2 4.79086 3.79086 3 6 3H10H18C20.2091 3 22 4.79086 22 7V8C22 8.55228 21.54 8.98368 21.0181 9.16437C19.8435 9.57105 19 10.687 19 12C19 13.313 19.8435 14.4289 21.0181 14.8356C21.54 15.0163 22 15.4477 22 16V17C22 19.2091 20.2091 21 18 21H10H6ZM10.75 6C10.75 5.58579 10.4142 5.25 10 5.25C9.58579 5.25 9.25 5.58579 9.25 6V8C9.25 8.41421 9.58579 8.75 10 8.75C10.4142 8.75 10.75 8.41421 10.75 8V6ZM10 15.25C10.4142 15.25 10.75 15.5858 10.75 16V18C10.75 18.4142 10.4142 18.75 10 18.75C9.58579 18.75 9.25 18.4142 9.25 18V16C9.25 15.5858 9.58579 15.25 10 15.25ZM10.75 11C10.75 10.5858 10.4142 10.25 10 10.25C9.58579 10.25 9.25 10.5858 9.25 11V13C9.25 13.4142 9.58579 13.75 10 13.75C10.4142 13.75 10.75 13.4142 10.75 13V11Z"
                      fill="#013A8A"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl mb-1 text-black">
                    {premiumServiceData?.header ||
                      "Premium Expedition Services"}
                  </h2>
                  <p className="text-gray">
                    {premiumServiceData?.title ||
                      "Experience the best in polar travel with our premium services"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {premiumServiceData ? (
                  <>
                    <div className="flex items-center gap-3 bg-[rgba(145,158,171,0.16)] p-5 rounded-[8px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.0018 7.19254C20.3096 7.46963 20.3346 7.94385 20.0575 8.25173L12.3199 16.8491C11.3454 17.9319 9.69549 18.0668 8.55793 17.1568L5.03151 14.3357C4.70806 14.0769 4.65562 13.6049 4.91438 13.2815C5.17313 12.958 5.6451 12.9056 5.96855 13.1644L9.49497 15.9855C10.012 16.3992 10.762 16.3378 11.205 15.8456L18.9426 7.24828C19.2197 6.9404 19.6939 6.91544 20.0018 7.19254Z"
                          fill="#013A8A"
                        />
                      </svg>
                      <span className="text-gray text-[20px]">
                        {premiumServiceData.description1}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-[rgba(145,158,171,0.16)] p-5 rounded-[8px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.0018 7.19254C20.3096 7.46963 20.3346 7.94385 20.0575 8.25173L12.3199 16.8491C11.3454 17.9319 9.69549 18.0668 8.55793 17.1568L5.03151 14.3357C4.70806 14.0769 4.65562 13.6049 4.91438 13.2815C5.17313 12.958 5.6451 12.9056 5.96855 13.1644L9.49497 15.9855C10.012 16.3992 10.762 16.3378 11.205 15.8456L18.9426 7.24828C19.2197 6.9404 19.6939 6.91544 20.0018 7.19254Z"
                          fill="#013A8A"
                        />
                      </svg>
                      <span className="text-gray text-[20px]">
                        {premiumServiceData.description2}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-[rgba(145,158,171,0.16)] p-5 rounded-[8px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.0018 7.19254C20.3096 7.46963 20.3346 7.94385 20.0575 8.25173L12.3199 16.8491C11.3454 17.9319 9.69549 18.0668 8.55793 17.1568L5.03151 14.3357C4.70806 14.0769 4.65562 13.6049 4.91438 13.2815C5.17313 12.958 5.6451 12.9056 5.96855 13.1644L9.49497 15.9855C10.012 16.3992 10.762 16.3378 11.205 15.8456L18.9426 7.24828C19.2197 6.9404 19.6939 6.91544 20.0018 7.19254Z"
                          fill="#013A8A"
                        />
                      </svg>
                      <span className="text-gray text-[20px]">
                        {premiumServiceData.description3}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-[rgba(145,158,171,0.16)] p-5 rounded-[8px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.0018 7.19254C20.3096 7.46963 20.3346 7.94385 20.0575 8.25173L12.3199 16.8491C11.3454 17.9319 9.69549 18.0668 8.55793 17.1568L5.03151 14.3357C4.70806 14.0769 4.65562 13.6049 4.91438 13.2815C5.17313 12.958 5.6451 12.9056 5.96855 13.1644L9.49497 15.9855C10.012 16.3992 10.762 16.3378 11.205 15.8456L18.9426 7.24828C19.2197 6.9404 19.6939 6.91544 20.0018 7.19254Z"
                          fill="#013A8A"
                        />
                      </svg>
                      <span className="text-gray text-[20px]">
                        {premiumServiceData.description4}
                      </span>
                    </div>
                  </>
                ) : (
                  // Fallback: Show 4 placeholders if no data
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      className="flex items-center gap-3 bg-[rgba(145,158,171,0.16)] p-5 rounded-[8px]"
                    >
                      <FaCheck size={24} color="#013a8a" />
                      <span className="text-gray text-[20px]">
                        Premium service feature
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stats and Inclusive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Happy Travelers Stats Card */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden text-center flex items-center justify-center">
                <div className="">
                  <div className="w-13 h-13 bg-[rgba(255,255,255,0.74)] rounded-full flex items-center justify-center mx-auto p-2">
                    <PiUsersThree size={40} color="#013c8c" />
                  </div>
                  <div className="text-[56px] font-bold my-2">3,200+</div>
                  <div className="">Happy Travelers</div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
              </div>

              {/* All Inclusive Card */}
              <div className="bg-[linear-gradient(288deg,#FF9416_0%,#FFFAF5_104.77%)] rounded-xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    {allInclusiveData ? (
                      <div className="flex flex-col gap-4 p-6 bg-[#FFF4E8] rounded-2xl text-gray">
                        <div className="flex items-center gap-3">
                          <FaCheck size={16} color="#013a8a" />
                          <span>{allInclusiveData.description1}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaCheck size={16} color="#013a8a" />
                          <span>{allInclusiveData.description2}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaCheck size={16} color="#013a8a" />
                          <span>{allInclusiveData.description3}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaCheck size={16} color="#013a8a" />
                          <span>{allInclusiveData.description4}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 p-6 bg-[#FFF4E8] rounded-2xl text-gray">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <FaCheck size={16} color="#013a8a" />
                            <span>Inclusive feature loading...</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            {/* Use the TravelAdvisor component */}
            <TravelAdvisor advisor={travelAdvisor} />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default WhyTravelUs;
