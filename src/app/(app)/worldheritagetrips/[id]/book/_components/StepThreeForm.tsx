import Link from "next/link";
import { useState } from "react";
import ThankYouModal from "@/components/shared/ThankyouModal";
import { IBooking } from "@/app/types/booking";

interface StepThreeFormProps {
  formData: IBooking;
  tripId?: number;
  shipId?: number;
  cabinId?: number;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  error: string | null;
  success: boolean;
}

const StepThreeForm = ({
  formData,
  tripId,
  shipId,
  cabinId,
  termsAccepted,
  setTermsAccepted,
  error,
  success,
}: StepThreeFormProps) => {
  const [showThankYou, setShowThankYou] = useState(success);

  return (
    <div className="bg-white rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Review your information</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Booking Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Trip ID</p>
            <p className="font-medium">{tripId || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600">Ship ID</p>
            <p className="font-medium">{shipId || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600">Cabin ID</p>
            <p className="font-medium">{cabinId || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">
              {formData.firstName} {formData.surname}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Gender</p>
            <p className="font-medium">{formData.gender}</p>
          </div>
          <div>
            <p className="text-gray-600">Date of Birth</p>
            <p className="font-medium">{formData.dob}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Travel Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Travel Date</p>
            <p className="font-medium">{formData.travelDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Number of Participants</p>
            <p className="font-medium">{formData.participants}</p>
          </div>
          <div>
            <p className="text-gray-600">Ship Name</p>
            <p className="font-medium">{formData.shipName}</p>
          </div>
          <div>
            <p className="text-gray-600">Room Preference</p>
            <p className="font-medium">
              {formData.roomCategory || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Mobile (During Travel)</p>
            <p className="font-medium">{formData.mobile}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600">Address</p>
            <p className="font-medium">{formData.street}</p>
            <p className="font-medium">
              {formData.city}, {formData.postcode}, {formData.country}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Emergency Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Stay-at-home Contact</p>
            <p className="font-medium">
              {formData.emergencyName || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Contact Number</p>
            <p className="font-medium">
              {formData.emergencyPhone || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Travel Insurance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Has Travel Insurance</p>
            <p className="font-medium">
              {formData.travelInsurance === "yes" ? "Yes" : "No"}
            </p>
          </div>
          {formData.travelInsurance === "yes" && (
            <>
              <div>
                <p className="text-gray-600">Insured At</p>
                <p className="font-medium">
                  {formData.insuranceProvider || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Policy Number</p>
                <p className="font-medium">
                  {formData.policyNumber || "Not provided"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Additional Information
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-gray-600">Additional Notes</p>
            <p className="font-medium">
              {formData.additionalNote || "None provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue focus:ring-blue-500"
          />
          <span className="text-gray-700">
            I agree to the{" "}
            <Link
              href="/pages/terms-condition"
              className="text-blue hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </Link>{" "}
            and confirm that the information provided is accurate.
          </span>
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <ThankYouModal
          isOpen={showThankYou}
          onClose={() => setShowThankYou(false)}
          title="Thank You!"
          message="Booking submitted successfully! We'll contact you shortly."
        />
      )}
    </div>
  );
};

export default StepThreeForm;
