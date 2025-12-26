"use client";

import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import GoogleSignIn from "./GoogleSignIn";
import { useTranslatedPlaceholder } from "@/hook/useTranslation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object") {
    if (
      "response" in error &&
      error.response &&
      typeof error.response === "object"
    ) {
      const response = error.response as unknown;
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as { data: unknown }).data;
        if (data && typeof data === "object" && "message" in data) {
          return String((data as { message: unknown }).message);
        }
      }
      if (response && typeof response === "object" && "message" in response) {
        return String((response as { message: unknown }).message);
      }
    }
    if ("message" in error) {
      return String((error as { message: unknown }).message);
    }
    if (
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
    ) {
      return String((error.data as { message: unknown }).message);
    }
  }

  // Fallback
  return "An unknown error occurred";
};

interface LoginFormProps {
  logo: React.ReactNode;
}

const LoginForm = ({ logo }: LoginFormProps) => {
  const emailPlaceholder = useTranslatedPlaceholder("Enter your email");
  const passwordPlaceholder = useTranslatedPlaceholder("Enter your password");
  const { setAuthenticated, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const wasRemembered = localStorage.getItem("rememberMe") === "true";

    if (wasRemembered && savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
      if (savedPassword) {
        setValue("password", savedPassword);
      }
    }
  }, [setValue]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
      toast.promise(login({ email: data.email, password: data.password }), {
        loading: "Logging in...",
        success: "Login successful!",
        error: (err) => {
          const errorMessage = err?.message || "Login failed";

          if (
            errorMessage.toLowerCase().includes("email") ||
            errorMessage.toLowerCase().includes("user not found") ||
            errorMessage.toLowerCase().includes("account not found")
          ) {
            return "Email address not found. Please check your email or sign up.";
          } else if (
            errorMessage.toLowerCase().includes("password") ||
            errorMessage.toLowerCase().includes("invalid credentials") ||
            errorMessage.toLowerCase().includes("wrong password")
          ) {
            return "Incorrect password. Please try again.";
          } else if (
            errorMessage.toLowerCase().includes("blocked") ||
            errorMessage.toLowerCase().includes("suspended")
          ) {
            return "Your account has been suspended. Please contact support.";
          } else {
            return errorMessage;
          }
        },
      });

      const res = await login({ email: data.email, password: data.password });

      if (!res.success) {
        const errorMessage = res.error || "Login failed";
        setError(errorMessage);
        return;
      }

      const token = res.token || res.access_token || res.data?.token;
      if (token) {
        // Check for redirect URL from middleware
        const redirectUrl = Cookies.get("redirect_url") || "/";

        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
          localStorage.setItem("rememberedPassword", data.password);
          localStorage.setItem("rememberMe", "true");
          Cookies.set("token", token, { expires: 10 });
          Cookies.set("user", JSON.stringify(res.user), { expires: 10 });
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
          Cookies.set("token", token, { expires: 7 });
          Cookies.set("user", JSON.stringify(res.user), { expires: 7 });
        }

        // Clear the redirect URL cookie after using it
        Cookies.remove("redirect_url");

        setAuthenticated(true);
        setUser(
          res.user
            ? {
                id: res.user.id ?? 0,
                name: res.user.name ?? "",
                email: res.user.email ?? "",
                username:
                  (res.user as unknown as { username?: string })?.username ??
                  null,
                avatar:
                  (res.user as unknown as { avatar?: string })?.avatar ?? "",
              }
            : null
        );
        reset();

        // Add small delay before navigation
        setTimeout(() => {
          router.push(redirectUrl);
        }, 300);
      } else {
        setError("Authentication token not received.");
        toast.error("Authentication token not received.");
      }
    } catch (err: unknown) {
      console.error("Unexpected login error:", err);
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full space-y-8 bg-white rounded-2xl p-8">
      <div className="flex flex-col items-center justify-center">{logo}</div>

      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your details to log in
        </p>
      </div>

      {/* Enhanced Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Email & Password */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="text-gray-800">
              E-mail address
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2.5 md:py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={emailPlaceholder}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full px-3 py-2.5 md:py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                placeholder={passwordPlaceholder}
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <PiEye className="w-5 h-5" />
                ) : (
                  <PiEyeClosed className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              {...register("rememberMe")}
              type="checkbox"
              className="h-4 w-4 text-blue focus:ring-blue border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <a
            href={"/forgot-password"}
            className="font-md text-sm text-secondary hover:text-secondary/80 cursor-pointer"
          >
            Forgot Password?
          </a>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-white bg-gradient-to-b from-blue via-[#0b6bf1] to-[#86b8ff] hover:bg-[#02357e] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        {/* OR Separator */}
        <div className="relative my-4 text-center">
          <p className="relative z-10 text-black">OR</p>
          <div className="absolute top-1/2 left-0 w-2/5 h-px -translate-y-1/2 bg-gray-500"></div>
          <div className="absolute top-1/2 right-0 w-2/5 h-px -translate-y-1/2 bg-gray-500"></div>
        </div>

        {/* Google Sign-In */}

        <GoogleSignIn />

        {/* Sign up */}
        <div className="text-center mt-4 text-sm text-gray-600 flex items-center justify-center gap-1">
          <p>Don&apos;t have an account?</p>
          <a
            href="/signup"
            className="font-medium text-secondary hover:text-secondary/80"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
