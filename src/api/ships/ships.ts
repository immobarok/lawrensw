import { apiFetch } from "../utils/client";

// Ship Cabin Interface
export interface ShipCabin {
  id: number;
  shipview_id: number;
  cabin_type: string;
  description: string;
  image: string;
  cabin_type_name: string;
}

// Ship Amenity Interface
export interface ShipAmenity {
  id: number;
  shipview_id: number;
  name: string;
  description?: string;
  image?: string;
}

// Ship Deck Interface
export interface ShipDeck {
  id: number;
  shipview_id: number;
  name: string;
  description?: string;
  image?: string;
}

// Ship Interface
export interface Ship {
  id: number;
  name: string;
  description: string;
  build_year: string;
  crew_number: number;
  max_guests: number;
  length: string;
  zodiac_boats: string;
  capacity: number;
  comfort_level: string;
  price: string;
  image: string;
  cabins: ShipCabin[];
  amenities: ShipAmenity[];
  decks: ShipDeck[];
}

// API Response Interface
export interface ShipsResponse {
  status: boolean;
  message: string;
  data: Ship[];
  code: number;
}

// Get all ships
export const getAllShips = async (): Promise<ShipsResponse> => {
  try {
    const response = await apiFetch<ShipsResponse>("/allShipDataApi", {
      method: "GET",
    });

    if (!response.success) {
      throw new Error("Failed to fetch ships");
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Ships API Error:", error);
    let errorMessage = "Failed to fetch ships";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const getShipById = async (id: number): Promise<Ship> => {
  try {
    const response = await apiFetch<{
      status: boolean;
      message: string;
      data: Ship;
      code: number;
    }>(`/allShipDataApi/${id}`, {
      method: "GET",
    });

    if (!response.success) {
      throw new Error("Failed to fetch ship details");
    }

    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Ship Details API Error:", error);
    let errorMessage = "Failed to fetch ship details";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

// Ship Hero Interface
export interface ShipHero {
  id: number;
  header: string;
  title: string;
  image: string;
  alt_tag: string;
}

// Ship Hero Response Interface
export interface ShipHeroResponse {
  status: boolean;
  message: string;
  data: ShipHero[];
  code: number;
}

// Get ship hero section
export const getShipHero = async (): Promise<ShipHeroResponse> => {
  try {
    const response = await apiFetch<ShipHeroResponse>("/shipPageBanApi/index", {
      method: "GET",
    });

    if (!response.success) {
      throw new Error("Failed to fetch ship hero data");
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Ship Hero API Error:", error);
    let errorMessage = "Failed to fetch ship hero data";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
