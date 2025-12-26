import { apiFetch } from "../utils/client";

export interface Snippet {
  id: number;
  title: string;
  slug: string;
  content: string;
  status?: number;
  meta_description?: string;
  image?: string;
}
export interface SnippetsResponse {
  status: boolean;
  message: string;
  data: Snippet[];
  code: number;
}

export const getSnippets = async (): Promise<Snippet[]> => {
  try {
    const response = await apiFetch<{
      status: boolean;
      message: string;
      data: any[];
      code: number;
    }>("/snippetApi", {
      method: "GET",
    });
    const apiData = response.data;
    console.log("Fetched snippets:", apiData);
    if (
      response.success &&
      apiData?.status === true &&
      Array.isArray(apiData.data)
    ) {
      return apiData.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        content: item.snippet_content, 
        status: item.status,
        meta_description: item.meta_description,
        image: item.image,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return [];
  }
};
