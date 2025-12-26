import { apiFetch } from "../utils/client";

export interface Subscription {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}


export interface SubscribeResponse {
  status: boolean;
  message: string;
  data: Subscription;
  code: number;
}



export const subscribe = async (email: string): Promise<Subscription> => {
  try {
    const response = await apiFetch<SubscribeResponse>("/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!response || !response.status) {
      throw new Error(response?.message || "Failed to subscribe");
    }
    return (response as unknown as SubscribeResponse).data;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};
