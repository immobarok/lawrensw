import { apiFetch, ApiResponse } from "../utils/client";

export interface PasswordData {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UserProfileData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  country?: string;
}

export interface UserProfile {
  id: number;
  avatar: string | null;
  name: string;
  username: string;
  email: string;
  date_of_birth: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;
  country: string | null;
}

export type UserProfileResponse = ApiResponse<{ data: UserProfile }>;

export type BookingStatus = "pending" | "approved" | "cancelled";

export const getUserInfo = async (): Promise<
  ApiResponse<{ data: UserProfile }>
> => {
  return apiFetch<{ data: UserProfile }>("/userSigninApi/edit", {
    method: "GET",
  });
};

export const updateUserInfo = async (
  data: UserProfileData
): Promise<ApiResponse<{ data: UserProfile }>> => {
  try {
    const response = await apiFetch<{ data: UserProfile }>(
      "/userSigninApi/update",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update profile";
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (
  data: PasswordData
): Promise<ApiResponse> => {
  try {
    const response = await apiFetch<unknown>("/userSigninApi/resetPassword", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to reset password";
    throw new Error(errorMessage);
  }
};

export const deleteAccount = async (): Promise<ApiResponse> => {
  try {
    const response = await apiFetch<unknown>("/userSigninApi/delete", {
      method: "DELETE",
    });
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete account";
    throw new Error(errorMessage);
  }
};

export const userBookingList = async (status: BookingStatus) => {
  try {
    const response = await apiFetch<unknown>(
      `/bookings/retrive?status=${status}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch booking list";
    throw new Error(errorMessage);
  }
};
