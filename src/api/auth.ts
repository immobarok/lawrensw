import { apiFetch, ApiResponse } from "./utils/client";

interface User {
  id?: number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

interface LoginResponseData {
  user?: User;
  token?: string | undefined;
  access_token?: string;
  status?: boolean; // Add status to match backend response
  message?: string; // Add message to match backend response
}

interface LoginResult {
  success: boolean;
  data?: LoginResponseData;
  token?: string;
  access_token?: string;
  user?: User;
  error?: string;
}

export const login = async (data: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  try {
    const res: ApiResponse<LoginResponseData> = await apiFetch(
      "/userSigninApi/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    //console.log("Login API Response:", res);

    if (!res.success) {
      let errorMessage = "Login failed";

      if (res.status === 401) {
        errorMessage = res.message || "Invalid email or password";
      } else {
        errorMessage = res.message || "Login request failed";
      }

      console.log("Login failed, returning error:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (res.data && res.data.status === false) {
      const errorMessage = res.data.message || "Invalid email or password";
      console.log("Backend data indicates failure:", errorMessage); // Debug log
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (
      res.success &&
      !res.token &&
      !res.access_token &&
      !res.data?.token &&
      !res.data?.access_token
    ) {
      return {
        success: false,
        error: "Authentication token not found in response",
      };
    }

    return {
      success: true,
      data: res.data,
      token: res.token,
      access_token: res.access_token,
      user: res.user,
    };
  } catch (err) {
    console.error("Login API Error (returning error):", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};

interface SignupResponseData {
  user?: User;
  token?: string;
  access_token?: string;
  message?: string;
  status?: boolean;
}

interface SignupResult {
  success: boolean;
  data?: SignupResponseData;
  token?: string;
  access_token?: string;
  user?: User;
  error?: string;
  message?: string;
}

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<SignupResult> => {
  try {
    const res: ApiResponse<SignupResponseData> = await apiFetch(
      "/create-account",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!res.success) {
      let errorMessage = "Signup failed";

      if (res.status === 400) {
        errorMessage = res.message || "Invalid signup data provided";
      } else if (res.status === 409) {
        errorMessage = res.message || "Email address is already registered";
      } else {
        errorMessage = res.message || "Signup request failed";
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (res.data && res.data.status === false) {
      const errorMessage = res.data.message || "Signup failed";
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (res.data && res.data.status === true) {
      return {
        success: true,
        data: res.data,
        user: res.data.user,
        token: undefined,
        message: res.data.message || "Account created successfully",
      };
    }

    const token =
      res.token ||
      res.access_token ||
      res.data?.token ||
      res.data?.access_token;

    if (token) {
      console.log("Signup successful with token");
      return {
        success: true,
        data: res.data,
        token: token,
        access_token: res.access_token,
        user: res.user || res.data?.user,
      };
    }

    console.log("Signup response unclear - no token or success status");
    return {
      success: false,
      error: "Signup response was unclear",
    };
  } catch (err) {
    console.error("Signup API Error (returning error):", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};

export const signInWithGoogle = async (data: {
  provider: string;
  token: string;
}) => {
  try {
    const response = await fetch("/social/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Google sign-in failed");
    }

    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Google authentication failed";
    throw new Error(errorMessage);
  }
};

interface LogoutResponseData {
  message?: string;
}

export const logout = async () => {
  const res: ApiResponse<LogoutResponseData> = await apiFetch(
    "/userSigninApi/logout",
    {
      method: "POST",
    }
  );

  return res;
};

// Forgot Password API Interfaces
interface SendOtpResponse {
  status: boolean;
  message: string;
  otp: number;
}

interface VerifyOtpResponse {
  status: boolean;
  message: string;
  reset_token: string;
}

interface ResetPasswordResponse {
  status: boolean;
  message: string;
}

// Send OTP for forgot password
export const forgotPassword = async (email: string) => {
  try {
    const response = await apiFetch<SendOtpResponse>("/forgetPass/sendOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.success && response.data) {
      return {
        success: response.data.status ?? false,
        message: response.data.message || "OTP sent successfully",
        otp: response.data.otp, // For development/testing - remove in production
      };
    }

    return {
      success: false,
      message: response.message || "Failed to send OTP",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "Server error: Failed to send OTP",
    };
  }
};

// Verify OTP and get reset token
export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await apiFetch<VerifyOtpResponse>(
      "/forgetPass/verifyOtp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (response.success && response.data) {
      return {
        status: response.data.status ?? false,
        message: response.data.message || "OTP verified successfully",
        reset_token: response.data.reset_token,
      };
    }

    return {
      status: false,
      message: response.message || "Failed to verify OTP",
      reset_token: undefined,
    };
  } catch (error: unknown) {
    console.error("Verify OTP error:", error);
    return {
      status: false,
      message: "Server error: Failed to verify OTP",
      reset_token: undefined,
    };
  }
};

// Reset password with new password
export const resetPassword = async (data: {
  email: string;
  new_password: string;
  new_password_confirmation: string;
  reset_token?: string; // Make reset_token optional
}) => {
  try {
    const response = await apiFetch<ResetPasswordResponse>(
      "/forgetPass/forgetResetPass",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.success && response.data) {
      return {
        status: response.data.status ?? false,
        message: response.data.message || "Password reset successfully",
      };
    }

    return {
      status: false,
      message: response.message || "Failed to reset password",
    };
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return {
      status: false,
      message: "Server error: Failed to reset password",
    };
  }
};
