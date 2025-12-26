import { apiFetch } from "../utils/client";

export interface SocialLink {
  id: number;
  name: string;
  link: string;
  icon: string;
  status: string;
}

export const getAllSocialLink = async (): Promise<SocialLink[]> => {
  try {
    const response = await apiFetch<{
      status: boolean;
      data: {
        data: Array<{
          id: number;
          url: string;
          image: string;
          status: string;
        }>;
      };
    }>("/social/media/retrive", {
      method: "GET",
    });

    const socialArray = response?.data?.data?.data;

    if (response?.data?.status === true && Array.isArray(socialArray)) {
      return socialArray.map(
        (item: { id: number; url: string; image: string; status: string }) => ({
          id: item.id,
          name: item.url.replace("www.", "").split(".")[0],
          link: item.url,
          icon: item.image,
          status: item.status,
        })
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
};

export interface FooterData {
  id: number;
  system_title: string;
  system_short_title: string;
  logo: string;
  minilogo: string;
  favicon: string;
  company_name: string;
  tag_line: string;
  phone_code: string;
  phone_number: string;
  whatsapp: string;
  email: string;
  time_zone: string;
  language: string;
  copyright_text: string;
  admin_title: string;
  admin_short_title: string;
  admin_logo: string;
  admin_mini_logo: string;
  admin_favicon: string;
  admin_copyright_text: string;
  googlemap: string | null;
}

export interface FooterResponse {
  status: boolean;
  message: string;
  data: {
    data: FooterData[];
    messages: string;
  };
  code: number;
}

export const getAllFooterTextAndLogo = async (): Promise<FooterData | null> => {
  try {
    const response = await apiFetch<{
      status: boolean;
      data: {
        data: FooterData[];
      };
    }>("/footer/text/retrive", {
      method: "GET",
    });
    const footerArray = response?.data?.data?.data;

    if (
      response?.data?.status === true &&
      Array.isArray(footerArray) &&
      footerArray.length > 0
    ) {
      return footerArray[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
};
