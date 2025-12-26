import { apiFetch, ApiResponse } from "../utils/client";

export interface ContactHeroData {
  id: number;
  header: string;
  title: string;
  image: string;
  alt_tag: string;
}

interface ContactHeroResponse {
  status: boolean;
  message: string;
  data: ContactHeroData[];
  code: number;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactResponseData {
  status: boolean;
  message: string;
  data?: unknown;
}

export interface ApiError {
  message: string;
  code?: number;
  errors?: Record<string, string[]>;
}

export const storeMessage = async (
  data: ContactData
): Promise<ApiResponse<ContactResponseData>> => {
  try {
    const response = await apiFetch<ContactResponseData>(
      "/getInTouchApi/store",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to send message");
    } else {
      throw new Error("Failed to send message");
    }
  }
};

export const getContactHeroSection = async (): Promise<ContactHeroData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contactPolTrvlBanApi/index`
    );

    if (response.ok) {
      const data = await response.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "status" in data &&
        "data" in data
      ) {
        const nestedResponse = data as ContactHeroResponse;
        if (nestedResponse.status && Array.isArray(nestedResponse.data)) {
          return nestedResponse.data;
        }
      }
      if (Array.isArray(data)) {
        return data as ContactHeroData[];
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching contact hero section:", error);
    return [];
  }
};

export interface Company {
  id: number;
  company_name: string;
  company_address: string;
  phone: string;
  email: string;
  opening_hours: string;
}

export interface CompanyApiResponse {
  status: boolean;
  message: string;
  data: Company[];
  code: number;
}

export const getCompanyInfo = async (): Promise<Company[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/companyInfoApi`
    );
    const json = await response.json();

    if (json.success && json.data) {
      const data = json.data as unknown;
      if (
        typeof data === "object" &&
        data !== null &&
        "status" in data &&
        "data" in data
      ) {
        const nestedResponse = data as CompanyApiResponse;
        if (nestedResponse.status && Array.isArray(nestedResponse.data)) {
          return nestedResponse.data;
        }
      }
      if (Array.isArray(data)) {
        return data as Company[];
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching company info:", error);
    return [];
  }
};
