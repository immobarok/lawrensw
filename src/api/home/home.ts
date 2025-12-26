import { apiFetch } from "../utils/client";

export const getAllInclusive = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/whyTravelWithUsapi/allInclusive`, {
    method: "GET",
  });
};

export const getAllPremiumServices = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/whyTravelWithUsapi/premiumService`, {
    method: "GET",
  });
};

export const getHeroInformation = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/homeBannerApi/index`, {
    method: "GET",
  });
};

export const gethomeExperienceImageSection = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/homeExperienceImageSectionApi/index`, {
    method: "GET",
  });
};

export const gethomeExperienceHeader = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/homeExperienceImageSectionApi/header`, {
    method: "GET",
  });
};

export const getAdvisorList = async () => {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/travelAdvisorApi/index`, {
    method: "GET",
  });
};



export const getHomeTourHeaderAndTitle = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/popularNatureTourApi/index`, {
    method: "GET",
  });
};

export const getDynamicTourButton = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/dynamicTripButtonApi/index`, {
    method: "GET",
  });
};



export const getAllHomeTour = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/homeTourApi/index`, {
    method: "GET",
  });
};