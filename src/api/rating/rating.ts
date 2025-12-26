import { apiFetch } from "../utils/client";

export interface ReviewData {
  id: number;
  name: string;
  email: string | null;
  rating: string;
  comment: string | null;
  image: string;
}

export interface RatingCalculation {
  average: number;
  count: number;
}

interface ReviewsApiResponse {
  status: boolean;
  message: string;
  data: ReviewData[];
  code: number;
}

export const getReviews = async (): Promise<ReviewData[]> => {
  const response = await apiFetch<ReviewsApiResponse>("/ratingApi/index", {
    method: "GET",
  });
  if (response.success && response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  console.error(
    "Failed to fetch reviews:",
    response.message || "An unknown error occurred"
  );
  return [];
};
export const getRatingData = async (): Promise<RatingCalculation> => {
  const response = await apiFetch<RatingCalculation>("/ratingApi/calculate", {
    method: "GET",
  });

  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.message || "Failed to fetch rating data.");
};

export interface HeaderData {
  id: number;
  header: string;
  title: string;
}

interface HeaderApiResponse {
  status: boolean;
  message: string;
  data: HeaderData;
  code: number;
}

export const getReviewHeader = async (): Promise<HeaderData> => {
  const response = await apiFetch<HeaderApiResponse>("/ratingApi/header", {
    method: "GET",
  });
  if (response.success && response.data && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.message || "Failed to fetch header data.");
};
