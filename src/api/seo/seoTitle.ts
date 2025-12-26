import { apiFetch } from "../utils/client";

// All Inclusive API
export const getAllSeoTitle = async () => {
  return apiFetch("/seoTitleApi/index", {
    method: "GET",
  });
};

export interface SeoResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    description: string;
    lang_id: number;
    language: {
      id: number;
      name: string;
      code: string;
    };
  };
}

const getSeoData = async (
  endpoint: string,
  lang_name: string
) => {
  return apiFetch(`/seoTitleApi/${endpoint}/${lang_name}`, {
    method: "GET",
  });
};

export const getArcticCruisesSeo = (lang_name: string) =>
  getSeoData("arcticCruise", lang_name);

export const getExpeditionAntarcticaSeo = (lang_name: string) =>
  getSeoData("expeditionAntarctica", lang_name);

export const getCruiseSvalbardSeo = (lang_name: string) =>
  getSeoData("cruiseSvalbard", lang_name);

export const getCruiseGreenlandSeo = (lang_name: string) =>
  getSeoData("cruiseGreenland", lang_name);