"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "../../../../public/assets/assets";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import Button from "@/components/ui/Button";
import { CgChevronRight } from "react-icons/cg";
import TripsPage from "./_components/TripsPage";
import DeleteAccountModal from "./_components/DeleteModal";
import { toast } from "sonner";
import {
  deleteAccount,
  getUserInfo,
  resetPassword,
  updateUserInfo,
} from "@/api/profile/profile";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { PasswordData } from "@/api/profile/profile";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "trips">("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
    country: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const { logout } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        console.log("user response", response);
        if (response.success && response.data) {
          // Type-safe access to nested data
          const responseData = response.data as unknown;
          if (
            responseData &&
            typeof responseData === "object" &&
            "data" in responseData
          ) {
            const userData = (responseData as { data: unknown }).data;
            if (userData && typeof userData === "object") {
              const user = userData as Record<string, unknown>;
              setFormData({
                name: (user.name as string) || "",
                email: (user.email as string) || "",
                phone: (user.phone as string) || "",
                address: (user.address as string) || "",
                city: (user.city as string) || "",
                zipcode: (user.zipcode as string) || "",
                country: (user.country as string) || "",
                avatar: (user.avatar as string) || "",
              });
            }
          }
        } else {
          toast.error(
            (response as { message?: string }).message ||
              "Failed to fetch user data"
          );
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch user data";
        toast.error(errorMessage);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteAccount();

      if (response.success) {
        toast.success("Account deleted successfully");
        logout();
        router.push("/");
      } else {
        toast.error(
          (response as { message?: string }).message ||
            "Failed to delete account"
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete account";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  const handlePasswordReset = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsResettingPassword(true);
    try {
      const response = await resetPassword(passwordData);

      if (response.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          old_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        toast.error(
          (response as { message?: string }).message ||
            "Failed to change password"
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true);
    try {
      const updateData = {
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zipcode: formData.zipcode,
        phone: formData.phone,
        name: formData.name,
      };

      const response = await updateUserInfo(updateData);

      if (response.success) {
        toast.success("Profile updated successfully");
        // Optionally refresh user data
        const userResponse = await getUserInfo();
        console.log("user", userResponse);
        if (userResponse.success && userResponse.data) {
          // Type-safe access to nested data
          const responseData = userResponse.data as unknown;
          if (
            responseData &&
            typeof responseData === "object" &&
            "data" in responseData
          ) {
            const userData = (responseData as { data: unknown }).data;
            if (userData && typeof userData === "object") {
              const user = userData as Record<string, unknown>;
              setFormData((prev) => ({
                ...prev,
                address: (user.address as string) || "",
                city: (user.city as string) || "",
                country: (user.country as string) || "",
                zipcode: (user.zipcode as string) || "",
                phone: (user.phone as string) || "",
                name: (user.name as string) || "",
              }));
            }
          }
        }
      } else {
        toast.error(
          (response as { message?: string }).message ||
            "Failed to update profile"
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full bg-[#F4F6F8] min-h-screen">
      <div className="text-black max-w-7xl mx-auto p-4">
        <div className="py-28 md:py-48">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Hey {formData.name || "loading..."},
          </h1>

          {/* Tabs */}
          <div className="flex justify-between items-center border-b border-gray-300 mt-6 pb-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 w-1/2 text-sm sm:text-base text-center items-center font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-secondary"
                  : "text-gray-500 hover:text-secondary"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("trips")}
              className={`pb-2 w-1/2 text-sm sm:text-base text-center items-center font-medium transition-colors ${
                activeTab === "trips"
                  ? "text-secondary "
                  : "text-gray-500 hover:text-secondary"
              }`}
            >
              Trips
            </button>
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {activeTab === "profile" && (
              <>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex gap-6 items-center">
                    <Image
                      src={formData?.avatar || assets.avatar}
                      width={100}
                      height={100}
                      alt="profile Image"
                      className="rounded-full w-16 h-auto"
                    />
                    <p className="text-lg font-medium text-gray-800">
                      {formData.email || ""}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="text-gray-800 font-semibold text-lg border-b-2 border-gray-500 cursor-pointer hover:text-secondary"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="bg-white p-6 my-16 rounded-2xl">
                  <h1 className="text-2xl">Personal Data</h1>
                  <div className="space-y-3 mt-6">
                    <div>
                      <label htmlFor="name" className="text-gray-800">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="appearance-none relative block w-full p-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 focus:z-10 sm:text-sm mt-2"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-gray-800">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled // Email is typically not editable
                        className="appearance-none relative block w-full p-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 focus:z-10 sm:text-sm mt-2 bg-gray-100"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="text-gray-800">
                        Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        value={formData.address}
                        onChange={handleChange}
                        className="appearance-none relative block w-full p-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 focus:z-10 sm:text-sm mt-2"
                        placeholder="Address"
                      />
                    </div>
                    <div className="flex gap-6">
                      <div className="w-full">
                        <label htmlFor="city" className="text-gray-800">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          autoComplete="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="appearance-none relative block w-full p-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 focus:z-10 sm:text-sm mt-2"
                          placeholder="City"
                        />
                      </div>
                      <div className="w-full">
                        <label htmlFor="zipcode" className="text-gray-800">
                          Postcode/Zip code
                        </label>
                        <input
                          id="zipcode"
                          name="zipcode"
                          type="text"
                          autoComplete="postal-code"
                          value={formData.zipcode}
                          onChange={handleChange}
                          className="appearance-none relative block w-full p-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 focus:z-10 sm:text-sm mt-2"
                          placeholder="Postcode/Zip code"
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-full">
                        <label htmlFor="country" className="text-gray-800">
                          Country
                        </label>
                        <input
                          id="country"
                          name="country"
                          type="text"
                          autoComplete="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="appearance-none relative block w-full p-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 focus:z-10 sm:text-sm mt-2"
                          placeholder="Country"
                        />
                      </div>
                      <div className="w-full">
                        <label htmlFor="phone" className="text-gray-800">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="appearance-none relative block w-full p-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 focus:z-10 sm:text-sm mt-2"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button
                        className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-3 rounded-md"
                        onClick={handleProfileUpdate}
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Personal data end here */}

                <div className="bg-white p-6 rounded-2xl">
                  <div className="space-y-2.5">
                    <h1 className="text-2xl font-semibold">Settings</h1>
                    <h1 className="text-gray-800 text-lg font-medium mb-8">
                      Change Password
                    </h1>

                    {/* Current Password */}
                    <div className="relative">
                      <label htmlFor="old_password" className="text-gray-800">
                        Current Password
                      </label>
                      <input
                        id="old_password"
                        name="old_password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="appearance-none relative block w-full px-3.5 py-3.5 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 sm:text-sm pr-10 mt-2"
                        placeholder="Current Password"
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 top-[70%] -translate-y-1/2 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <PiEye /> : <PiEyeClosed />}
                      </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <label htmlFor="new_password" className="text-gray-800">
                        New Password
                      </label>
                      <input
                        id="new_password"
                        name="new_password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="appearance-none relative block w-full px-3.5 py-3.5 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 sm:text-sm pr-10 mt-2"
                        placeholder="New Password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 top-[70%] -translate-y-1/2 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <PiEye /> : <PiEyeClosed />}
                      </button>
                    </div>

                    {/* Repeat New Password */}
                    <div className="relative">
                      <label
                        htmlFor="new_password_confirmation"
                        className="text-gray-800"
                      >
                        Repeat New Password
                      </label>
                      <input
                        id="new_password_confirmation"
                        name="new_password_confirmation"
                        type={showRepeatPassword ? "text" : "password"}
                        required
                        className="appearance-now relative block w-full px-3.5 py-3.5 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue focus:border-blue-500 sm:text-sm pr-10 mt-2"
                        placeholder="Repeat New Password"
                        value={passwordData.new_password_confirmation}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 top-[70%] -translate-y-1/2 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowRepeatPassword(!showRepeatPassword)
                        }
                      >
                        {showRepeatPassword ? <PiEye /> : <PiEyeClosed />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button
                        className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-3 rounded-md"
                        onClick={handlePasswordReset}
                        disabled={isResettingPassword}
                      >
                        {isResettingPassword
                          ? "Changing..."
                          : "Change Password"}
                      </Button>
                    </div>

                    <Button
                      onClick={() => setShowModal(true)}
                      className="bg-[#F4F6F8] text-gray-800 font-medium w-full py-3 mt-2 flex justify-between items-center px-6 hover:bg-[#f0f2f5]"
                    >
                      <p>Delete Account</p>
                      <CgChevronRight />
                    </Button>
                    <DeleteAccountModal
                      isOpen={showModal}
                      onClose={() => setShowModal(false)}
                      onDelete={handleDeleteAccount}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "trips" && (
              <div className="h-auto">
                <TripsPage />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
