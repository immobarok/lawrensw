"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TripBookingData, submitTripBooking } from "@/api/trip/trips";
import { z } from "zod";
import { toast } from "sonner";
import {
  bookingFormSchema,
  tripBookingDataSchema,
  step1Schema,
  step2Schema,
} from "./bookingValidation";

import Button from "@/components/ui/Button";
import StepOneForm from "./StepOneForm";
import StepTwoForm from "./StepTwoForm";
import StepThreeForm from "./StepThree";
import ThankYouModal from "@/components/shared/ThankyouModal";
import Stepper from "./Stepper";


interface StepsFormProps {
  tripId?: number;
  cabinId?: number;
}

const StepsForm = ({ tripId = 1, cabinId = 1 }: StepsFormProps) => {
  const searchParams = useSearchParams();
  const shipName = decodeURIComponent(searchParams?.get("shipName") || "");
  const travelDate = decodeURIComponent(searchParams?.get("travelDate") || "");

  const [step, setStep] = useState(1);
  const maxStep = 3;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const [formData, setFormData] = useState({
    participants: "",
    travelDate: travelDate,
    roomCategory: "",
    shipName: shipName,
    firstName: "",
    surname: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    street: "",
    country: "",
    postcode: "",
    city: "",
    emergencyName: "",
    emergencyPhone: "",
    travelInsurance: "no",
    insuranceProvider: "",
    policyNumber: "",
    additionalNote: "",
  });

  const submitBooking = async () => {
    if (!termsAccepted) {
      setError("Please agree to the Terms and Conditions to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const validatedFormData = bookingFormSchema.parse(formData);
      const bookingData: TripBookingData = {
        trips_two_id: tripId,
        cabin_two_id: cabinId,
        number_of_members: parseInt(validatedFormData.participants) || 1,
        name: validatedFormData.firstName,
        surname: validatedFormData.surname,
        gender: validatedFormData.gender.toLowerCase(),
        date_of_birth: validatedFormData.dob,
        mobile: validatedFormData.mobile,
        email: validatedFormData.email,
        street_house_number: validatedFormData.street,
        country: validatedFormData.country,
        post_code: validatedFormData.postcode,
        city_place_name: validatedFormData.city,
        stay_at_home_contact: validatedFormData.emergencyName || undefined,
        contact_no_home_caller: validatedFormData.emergencyPhone || undefined,
        room_preference: validatedFormData.roomCategory || undefined,
        travel_insurance: validatedFormData.travelInsurance,
        insured_at:
          validatedFormData.travelInsurance === "yes"
            ? validatedFormData.insuranceProvider
            : undefined,
        policy_number:
          validatedFormData.travelInsurance === "yes"
            ? validatedFormData.policyNumber
            : undefined,
        additional_note: validatedFormData.additionalNote || undefined,
        terms_condition_check: termsAccepted,
      };

      tripBookingDataSchema.parse(bookingData);
      const response = await submitTripBooking(bookingData);
      if (!response.status) {
        throw new Error(response.message || "Failed to submit booking");
      }
      setSuccess(true);
      setShowThankYouModal(true); // Show the thank you modal
      toast.success(
        "Booking submitted successfully! We'll contact you shortly."
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues
          .map((issue) => issue.message)
          .join(", ");
        setError(`Validation error: ${errorMessages}`);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to submit booking. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number) => {
    try {
      if (step === 1) {
        step1Schema.parse(formData);
        setStep1Errors({});
        return true;
      } else if (step === 2) {
        step2Schema.parse(formData);
        setStep2Errors({});
        return true;
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });

        if (step === 1) {
          setStep1Errors(errors);
        } else if (step === 2) {
          setStep2Errors(errors);
        }
      }
      return false;
    }
  };

  const nextStep = () => {
    if (step < maxStep) {
      if (validateStep(step)) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setStep(value);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl ">Complete Your Booking</h1>
        <p className="text-sm font-medium text-gray text-nowrap">
          Step {step} of {maxStep}
        </p>
      </div>

      {/* Stepper */}
      <Stepper
        step={step}
        maxStep={maxStep}
        setStep={setStep}
        handleSliderChange={handleSliderChange}
      />

      {/* Step Content */}
      <div>
        {step === 1 && (
          <StepOneForm
            formData={formData}
            handleChange={handleChange}
            step1Errors={step1Errors}
            shipName={shipName}
          />
        )}
        {step === 2 && (
          <StepTwoForm
            formData={formData}
            handleChange={handleChange}
            step2Errors={step2Errors}
          />
        )}
        {step === 3 && (
          <StepThreeForm
            formData={formData}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            error={error}
          />
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button
          className="border border-blue text-blue font-semibold px-8 py-3 rounded-md"
          onClick={prevStep}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button
          className="bg-blue text-white font-semibold px-8 py-3 rounded-md"
          onClick={() => (step === maxStep ? submitBooking() : nextStep())}
          disabled={loading}
        >
          {loading ? "Submitting..." : step === maxStep ? "Submit" : "Next"}
        </Button>
      </div>
      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        title="Thank You!"
        message="Booking submitted successfully! We'll contact you shortly."
      />
    </div>
  );
};

export default StepsForm;
