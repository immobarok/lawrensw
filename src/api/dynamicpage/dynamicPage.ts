import { apiFetch } from "../utils/client";

export interface DynamicPage {
  id: number;
  page_header: string;
  page_title: string;
  page_slug: string;
  page_content: string;
  status?: number;
  meta_description?: string;
  image?:string;
}

export interface DynamicPagesResponse {
  status: boolean;
  message: string;
  data: DynamicPage[];
  code: number;
}

export const getDynamicPages = async (): Promise<DynamicPage[]> => {
  try {
    const response = await apiFetch<{
      status: boolean;
      message: string;
      data: DynamicPage[];
      code: number;
    }>("/dynamicPage/index", {
      method: "GET",
    });
    const apiData = response.data;
    //console.log("Fetched dynamic pages:", apiData);

    if (
      response.success &&
      apiData?.status === true &&
      Array.isArray(apiData.data)
    ) {
      return apiData.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching dynamic pages:", error);
    return [];
  }
};

export const getDynamicPageBySlug = async (
  slug: string
): Promise<DynamicPage | null> => {
  try {
    const response = await apiFetch<{
      status: boolean;
      message: string;
      data: DynamicPage;
      code: number;
    }>(`/dynamicPage/show/${slug}`, {
      method: "GET",
    });

    const apiData = response.data;
    console.log("Fetched dynamic page by slug:", apiData);

    if (
      response.success &&
      apiData?.status === true && 
      apiData.data &&
      typeof apiData.data === "object"
    ) {
      return apiData.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching dynamic page by slug:", error);
    return null;
  }
};
