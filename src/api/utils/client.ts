import Cookies from "js-cookie";

// Base interfaces
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  status: number;
  data: T;
  message?: string;
  token?: string;
  access_token?: string;
  user?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  message: string;
  data?: never;
  token?: never;
  access_token?: never;
  user?: never;
}

// Specific interface for OTP verification
export interface VerifyOTPSuccessResponse {
  status: boolean;
  message: string;
  reset_token?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
export type VerifyOTPResponse = VerifyOTPSuccessResponse | ApiErrorResponse;

// Then update the apiFetch function return type
export const apiFetch = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = Cookies.get("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    // Handle 401 Unauthorized
    if (res.status === 401) {
      // If we received 401, token is invalid/expired. Force a logout.
      const forceLogout = () => {
        try {
          Cookies.remove("token");
        } catch (e) {
          // ignore
        }

        try {
          // only clear keys we control; localStorage.clear() might be too aggressive in some apps,
          // but here original behavior cleared it so keep that behavior.
          if (typeof localStorage !== "undefined") {
            localStorage.clear();
          }
        } catch (e) {
          // ignore
        }

        // Dispatch an event so other parts of the app can react if needed
        if (typeof window !== "undefined") {
          try {
            window.dispatchEvent(new CustomEvent("app:force-logout"));
          } catch (e) {
            // ignore
          }

          // Redirect to the login page. Adjust path if your login route differs.
          try {
            const loginPath = "/auth/login";
            // Preserve current url so after login user can be redirected back if needed
            const redirectTo = `${loginPath}?expired=1`;
            window.location.href = redirectTo;
          } catch (e) {
            // ignore
          }
        }
      };

      // For login endpoint, try to parse the response body for specific error message and return it
      if (endpoint.includes("/login") || endpoint.includes("/signin")) {
        try {
          const errorText = await res.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            // still perform logout cleanup
            forceLogout();
            return {
              success: false,
              status: 401,
              message: errorData.message || "Invalid email or password",
            };
          }
        } catch {
          // If parsing fails, fall through to default handling
        }
      }

      // Default 401 handling for other endpoints: perform logout and return auth error
      forceLogout();
      return {
        success: false,
        status: 401,
        message: "Authentication required",
      };
    }

    // Handle 404 Not Found
    if (res.status === 404) {
      return {
        success: false,
        status: 404,
        message: "Resource not found",
      };
    }

    // Handle other errors
    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;

      try {
        const errorText = await res.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            errorMessage =
              errorText.length > 100
                ? `${errorMessage}: ${errorText.substring(0, 100)}...`
                : `${errorMessage}: ${errorText}`;
          }
        }
      } catch {
        errorMessage = res.statusText || errorMessage;
      }

      return {
        success: false,
        status: res.status,
        message: errorMessage,
      };
    }

    // Handle successful response
    try {
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      return {
        success: true,
        status: res.status,
        data: data,
        // Include token properties if they exist in the response
        ...(data.token && { token: data.token }),
        ...(data.access_token && { access_token: data.access_token }),
        ...(data.user && { user: data.user }),
      };
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      return {
        success: false,
        status: res.status,
        message: "Failed to parse response",
      };
    }
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      status: 0,
      message:
        error instanceof Error ? error.message : "Network error occurred",
    };
  }
};
