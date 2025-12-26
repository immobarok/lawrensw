import { Trip } from "@/app/types/trip";
import { apiFetch } from "../utils/client";

export interface TripFilters {
  page?: number;
  destinations?: string;
  region?: string;
  ship_name?: string;
  departure_date?: string;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface TripListPageTwoFilters {
  page?: number;
  destinations?: string;
  departure_date?: string;
  duration?: number;
  min_duration?: number;
  ship?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface AmountSortFilters {
  order: "asc" | "desc";
  page?: number;
  limit?: number;
  destinations?: string;
  departure_date?: string;
  ship?: string;
}

export interface TripsWithPagination {
  trips: Trip[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// In your types file
export interface TripBookingData {
  trips_two_id: string | number;
  cabin_two_id: string | number;
  number_of_members: number;
  name: string;
  surname: string;
  gender: string;
  date_of_birth: string;
  mobile: string;
  email: string;
  street_house_number: string;
  country: string;
  post_code: string;
  city_place_name: string;
  stay_at_home_contact?: string;
  contact_no_home_caller?: string;
  room_preference: string | undefined;
  travel_insurance: string;
  insured_at?: string;
  policy_number?: string;
  additional_note?: string;
  terms_condition_check: boolean;
}

export interface TripBookingData2 {
  trip_id: number;
  ship_id: number;
  cabin_id: number;
  number_of_members: number;
  name: string;
  surname: string;
  gender: string;
  date_of_birth: string;
  mobile: string;
  email: string;
  street_house_number: string;
  country: string;
  post_code: string;
  city_place_name: string;
  stay_at_home_contact?: string;
  contact_no_home_caller?: string;
  room_preference: string;
  travel_insurance: string;
  insured_at?: string;
  policy_number?: string;
  additional_note?: string;
  terms_condition_check: boolean;
}

export const getAllTrips = async (
  filters: TripFilters = {}
): Promise<TripsWithPagination> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `/trips/two/retrive${queryString ? `?${queryString}` : ""}`;

    const response = await apiFetch<{
      data: {
        trips: {
          data: Trip[];
          current_page: number;
          last_page: number;
          total: number;
        };
      };
    }>(url, {
      method: "GET",
    });

    if (!response.success) {
      throw new Error("Failed to fetch trips");
    }

    if (response.data && response.data.data && response.data.data.trips) {
      const tripsData = response.data.data.trips;

      return {
        trips: tripsData.data || [],
        currentPage: tripsData.current_page || 1,
        totalPages: tripsData.last_page || 1,
        totalItems: tripsData.total || 0,
      };
    }

    return {
      trips: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    };
  } catch (error: unknown) {
    console.error("❌ API Error:", error);
    let errorMessage = "Failed to fetch trips";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const getTripListPageTwo = async (
  filters: TripListPageTwoFilters = {}
): Promise<TripsWithPagination> => {
  try {
    const queryParams = new URLSearchParams();

    const {
      page = 1,
      destinations = "",
      departure_date = "",
      duration,
      min_duration,
      ship = "",
      min_price,
      max_price,
      limit,
      sort_by,
      order,
      ...otherFilters
    } = filters;

    if (page) queryParams.append("page", page.toString());
    if (destinations) queryParams.append("destinations", destinations);
    if (departure_date) queryParams.append("departure_date", departure_date);
    if (duration) queryParams.append("duration", duration.toString());
    if (min_duration)
      queryParams.append("min_duration", min_duration.toString());
    if (ship) queryParams.append("ship", ship);
    if (min_price) queryParams.append("min_price", min_price.toString());
    if (max_price) queryParams.append("max_price", max_price.toString());

    if (limit) queryParams.append("limit", limit.toString());
    if (sort_by) queryParams.append("sort_by", sort_by);
    if (order) queryParams.append("order", order);

    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `/trips/retrive${queryString ? `?${queryString}` : ""}`;

    const response = await apiFetch<{
      data: {
        trips: {
          data: Trip[];
          current_page: number;
          last_page: number;
          total: number;
        };
      };
    }>(url, {
      method: "GET",
    });

    if (!response.success) {
      throw new Error("Failed to fetch trips from page two");
    }

    // Handle the actual API response structure - same as getAllTrips
    if (response.data && response.data.data && response.data.data.trips) {
      const tripsData = response.data.data.trips;

      return {
        trips: tripsData.data || [],
        currentPage: tripsData.current_page || page,
        totalPages: tripsData.last_page || 1,
        totalItems: tripsData.total || 0,
      };
    }

    return {
      trips: [],
      currentPage: page,
      totalPages: 1,
      totalItems: 0,
    };
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch trips from page two";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const getTripsDetailsTwo = async (id: number) => {
  return apiFetch(`/trips/${id}`, {
    method: "GET",
  });
};

export const getExpeditionsById = async (id: number) => {
  return apiFetch(`/trips/two/${id}`, {
    method: "GET",
  });
};

export const submitTripBooking = async (data: TripBookingData) => {
  try {
    const response = await apiFetch("/bookings-two/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to submit booking");
    } else {
      throw new Error("Failed to submit booking");
    }
  }
};

export const submitTripBookingTwo = async (data: TripBookingData2) => {
  try {
    const response = await apiFetch("/bookings/trip/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to submit booking");
    } else {
      throw new Error("Failed to submit booking");
    }
  }
};

export const getAllTripsPage2 = getTripListPageTwo;

// Update your getTripsSortedByAmount function
export interface AmountSortFilters {
  order: "asc" | "desc";
  page?: number;
  limit?: number;
  destinations?: string;
  departure_date?: string;
  min_duration?: number;
  max_duration?: number;
  ship?: string;
  min_price?: number;
  max_price?: number;
}

export const getTripsSortedByAmount = async (
  filters: AmountSortFilters
): Promise<TripsWithPagination> => {
  try {
    const queryParams = new URLSearchParams();

    const {
      order,
      page = 1,
      limit = 9,
      destinations = "",
      departure_date = "",
      min_duration,
      max_duration,
      ship = "",
      min_price,
      max_price,
    } = filters;

    // Add sorting parameters
    queryParams.append("sort_by", "amount");
    queryParams.append("order", order);

    // Add pagination
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Add filters
    if (destinations) queryParams.append("destinations", destinations);
    if (departure_date) queryParams.append("departure_date", departure_date);
    if (min_duration)
      queryParams.append("min_duration", min_duration.toString());
    if (max_duration)
      queryParams.append("max_duration", max_duration.toString());
    if (ship) queryParams.append("ship", ship);
    if (min_price) queryParams.append("min_price", min_price.toString());
    if (max_price) queryParams.append("max_price", max_price.toString());

    const queryString = queryParams.toString();

    // Use the main trips endpoint with sorting parameters
    const url = `/trips/retrive${queryString ? `?${queryString}` : ""}`;

    console.log("Sorting API URL:", url);

    const response = await apiFetch<Record<string, unknown>>(url, {
      method: "GET",
    });

    console.log("Sorting API Response:", response);

    if (!response.success) {
      throw new Error("Failed to fetch sorted trips by amount");
    }

    // Handle different possible response structures
    let tripsData: Trip[] = [];
    let currentPage = page;
    let totalPages = 1;
    let totalItems = 0;

    const responseData = response.data as Record<string, unknown>;

    if (responseData && responseData.data) {
      // Case 1: response.data.data contains the trips array directly
      if (Array.isArray(responseData.data)) {
        tripsData = responseData.data as Trip[];
        currentPage =
          ((responseData as Record<string, unknown>).current_page as number) ||
          page;
        totalPages =
          ((responseData as Record<string, unknown>).last_page as number) || 1;
        totalItems =
          ((responseData as Record<string, unknown>).total as number) || 0;
      }
      // Case 2: response.data.data has a trips property
      else if (
        (responseData.data as Record<string, unknown>).trips &&
        Array.isArray(
          (
            (responseData.data as Record<string, unknown>).trips as Record<
              string,
              unknown
            >
          ).data
        )
      ) {
        const tripsObj = (responseData.data as Record<string, unknown>)
          .trips as Record<string, unknown>;
        tripsData = tripsObj.data as Trip[];
        currentPage = (tripsObj.current_page as number) || page;
        totalPages = (tripsObj.last_page as number) || 1;
        totalItems = (tripsObj.total as number) || 0;
      }
      // Case 3: response.data has trips directly
      else if (
        (responseData as Record<string, unknown>).trips &&
        Array.isArray(
          (
            (responseData as Record<string, unknown>).trips as Record<
              string,
              unknown
            >
          ).data
        )
      ) {
        const tripsObj = (responseData as Record<string, unknown>)
          .trips as Record<string, unknown>;
        tripsData = tripsObj.data as Trip[];
        currentPage = (tripsObj.current_page as number) || page;
        totalPages = (tripsObj.last_page as number) || 1;
        totalItems = (tripsObj.total as number) || 0;
      }
    }

    return {
      trips: tripsData,
      currentPage,
      totalPages,
      totalItems,
    };
  } catch (error: unknown) {
    console.error("Sorting API Error:", error);
    let errorMessage = "Failed to fetch trips sorted by amount";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
