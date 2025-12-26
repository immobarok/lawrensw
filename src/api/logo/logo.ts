import { apiFetch } from "../utils/client";

export interface LogoData {
  logo: string;
  favicon: string;
}

export interface LogoResponse {
  status: boolean;
  message: string;
  data: {
    data: LogoData;
    messages: string;
  };
  code: number;
}

export const getLogoAndFavicon = async (): Promise<LogoData | null> => {
  try {
    const response = await apiFetch<LogoResponse>("/logo/retrive", {
      method: "GET",
    });

    if (response?.data?.status === true && response?.data?.data?.data) {
      return response.data.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching logo data:", error);
    return null;
  }
};
