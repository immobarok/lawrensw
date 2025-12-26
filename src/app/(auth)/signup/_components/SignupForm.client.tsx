"use client";

import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/api/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import GoogleSignUp from "./GoogleSignUp";
import { useTranslatedPlaceholder } from "@/hook/useTranslation";

// Password validation schema
const passwordValidation = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: passwordValidation,
    password_confirmation: z.string().min(1, "Confirm password is required"),
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

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

interface SignupFormProps {
  logo: React.ReactNode;
}

const SignupForm = ({ logo }: SignupFormProps) => {
  const emailPlaceholder = useTranslatedPlaceholder("Enter your email");
  const passwordPlaceholder = useTranslatedPlaceholder("Enter your password");
  const namePlaceholder = useTranslatedPlaceholder("Enter your full name");
  const confirmPasswordPlaceholder = useTranslatedPlaceholder("Confirm your password");

  const { setAuthenticated, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      rememberMe: false,
    },
  });

  const passwordValue = watch("password");

  useEffect(() => {
    if (passwordValue) {
      setPasswordStrength({
        hasUpperCase: /[A-Z]/.test(passwordValue),
        hasLowerCase: /[a-z]/.test(passwordValue),
        hasNumber: /[0-9]/.test(passwordValue),
        hasSpecialChar: /[^A-Za-z0-9]/.test(passwordValue),
        hasMinLength: passwordValue.length >= 8,
      });
    } else {
      setPasswordStrength({
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false,
      });
    }
  }, [passwordValue]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const wasRemembered = localStorage.getItem("rememberMe") === "true";

    if (wasRemembered && savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError("");

    try {
      const toastId = toast.loading("Creating your account...");

      const res = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (!res.success) {
        const errorMessage = res.error || "Signup failed";
        setError(errorMessage);

        // Dismiss loading toast
        toast.dismiss(toastId);

        if (
          errorMessage.toLowerCase().includes("email") ||
          errorMessage.toLowerCase().includes("already exists") ||
          errorMessage.toLowerCase().includes("taken") ||
          errorMessage.toLowerCase().includes("registered") ||
          errorMessage.toLowerCase().includes("user already exists") ||
          errorMessage.toLowerCase().includes("user exists")
        ) {
          setError("User already exists");
          toast.error(
            "User already exists. Please use a different email address."
          );
        } else if (
          errorMessage.toLowerCase().includes("password") ||
          errorMessage.toLowerCase().includes("weak") ||
          errorMessage.toLowerCase().includes("short")
        ) {
          setError("Password is too weak");
          toast.error(
            "Password is too weak. Please choose a stronger password."
          );
        } else if (
          errorMessage.toLowerCase().includes("name") ||
          errorMessage.toLowerCase().includes("invalid")
        ) {
          setError("Invalid name");
          toast.error("Please provide a valid name.");
        } else {
          setError(errorMessage);
          toast.error(errorMessage);
        }
        return;
      }

      const token = res.token || res.access_token || res.data?.token;

      if (token) {
        // Update to success toast
        toast.success("Account created successfully!", { id: toastId });

        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
          localStorage.setItem("rememberMe", "false");
          Cookies.set("token", token, { expires: 10 });
          Cookies.set("user", JSON.stringify(res.user), { expires: 10 });
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
          Cookies.set("token", token, { expires: 7 });
          Cookies.set("user", JSON.stringify(res.user), { expires: 7 });
        }

        setUser({
          id: (res.user as unknown as { id?: number })?.id ?? 0,
          name: (res.user as unknown as { name?: string })?.name ?? "",
          email: (res.user as unknown as { email?: string })?.email ?? "",
          username:
            (res.user as unknown as { username?: string })?.username ?? null,
          avatar: (res.user as unknown as { avatar?: string })?.avatar ?? "",
        });
        reset();
        setAuthenticated(true);

        // Add small delay before navigation
        setTimeout(() => {
          router.push("/");
        }, 300);
      } else {
        // Dismiss loading toast and show success message
        toast.dismiss(toastId);
        toast.success(
         "Account created successfully! Please log in."
        );
        reset();
        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
          localStorage.setItem("rememberMe", "true");
        }

        // Add small delay before navigation to login page
        setTimeout(() => {
          router.push("/login");
        }, 300);
      }
    } catch (err: unknown) {
      console.error("Unexpected signup error:", err);

      const message = getErrorMessage(err);
      setError(message);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full space-y-4 bg-white rounded-2xl p-8">
      <div className="flex flex-col items-center">{logo}</div>
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your details to create account
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

      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md space-y-2">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="text-gray-800">
              Full Name
            </label>
            <input
              id="fullName"
              {...register("name")}
              type="text"
              placeholder={namePlaceholder}
              className="appearance-none relative block w-full px-3 py-2.5 md:py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-gray-800">
              E-mail address
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder={emailPlaceholder}
              className="appearance-none relative block w-full px-3 py-2.5 md:py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
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
                placeholder={passwordPlaceholder}
                className="w-full px-3 py-2.5 md:py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                autoComplete="new-password"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <PiEye className="w-5 h-5" />
                ) : (
                  <PiEyeClosed className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            {/* Password Strength Indicator */}
            {passwordValue && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Password must contain:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        passwordStrength.hasMinLength
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        passwordStrength.hasMinLength
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        passwordStrength.hasUpperCase
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        passwordStrength.hasUpperCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        passwordStrength.hasLowerCase
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        passwordStrength.hasLowerCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        passwordStrength.hasNumber
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        passwordStrength.hasNumber
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      One number
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        passwordStrength.hasSpecialChar
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        passwordStrength.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      One special character
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="password_confirmation"
                {...register("password_confirmation")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder={confirmPasswordPlaceholder}
                className="w-full px-3 py-2.5 md:py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                autoComplete="new-password"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <PiEye className="w-5 h-5" />
                ) : (
                  <PiEyeClosed className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              {...register("rememberMe")}
              type="checkbox"
              className="h-4 w-4 text-blue focus:ring-blue border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2.5 md:py-3.5 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-b from-blue via-[#0b6bf1] to-[#86b8ff] hover:bg-[#02357e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Signing Up..." : "SignUp"}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-2 text-center">
          <span className="relative z-10 text-black">OR</span>
          <div className="absolute top-1/2 left-0 h-px w-2/5 -translate-y-1/2 transform bg-gray-500"></div>
          <div className="absolute top-1/2 right-0 h-px w-2/5 -translate-y-1/2 transform bg-gray-500"></div>
        </div>
        <GoogleSignUp />

        {/* <p className="text-center mt-4 text-sm text-gray-600">
          Already have account?{" "}
          <a
            href="/login"
            className="font-medium text-secondary hover:text-secondary/80"
          >
            Log in
          </a>
        </p> */}

        <div className="text-center mt-4 text-sm text-gray-600 flex items-center justify-center gap-1">
          <p>Already have account?</p>
          <a
            href="/login"
            className="font-medium text-secondary hover:text-secondary/80"
          >
            Log in
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
