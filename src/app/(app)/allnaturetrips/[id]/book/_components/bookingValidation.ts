import { z } from "zod";

// Step 1 validation schema
export const step1Schema = z.object({
  participants: z.string().min(1, "Number of participants is required"),
  travelDate: z.string().min(1, "Travel date is required"),
  roomCategory: z.string().min(1, "Room preference is required"), // ✅ required now
  shipName: z.string().min(1, "Ship name is required"),
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of birth is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email address"),
});

export const step2Schema = z
  .object({
    street: z.string().min(1, "Street address is required"),
    country: z.string().min(1, "Country is required"),
    postcode: z.string().min(1, "Post code is required"),
    city: z.string().min(1, "City is required"),
    emergencyName: z.string().optional(),
    emergencyPhone: z.string().optional(),
    travelInsurance: z.string().refine((val) => val === "yes" || val === "no", {
      message: "Please select if you have travel insurance",
    }),
    insuranceProvider: z.string().optional(),
    policyNumber: z.string().optional(),
    additionalNote: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.travelInsurance === "yes") {
        return (
          data.insuranceProvider && data.insuranceProvider.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Insurance provider is required when you have travel insurance",
      path: ["insuranceProvider"],
    }
  )
  .refine(
    (data) => {
      if (data.travelInsurance === "yes") {
        return data.policyNumber && data.policyNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: "Policy number is required when you have travel insurance",
      path: ["policyNumber"],
    }
  );

export const bookingFormSchema = z
  .object({
    // Step 1 fields
    participants: z.string().min(1, "Number of participants is required"),
    travelDate: z.string().min(1, "Travel date is required"),
    roomCategory: z.string().min(1, "Room preference is required"), // ✅ required now
    shipName: z.string().min(1, "Ship name is required"),
    firstName: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Surname is required"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    mobile: z.string().min(1, "Mobile number is required"),
    email: z.string().email("Invalid email address"),

    // Step 2 fields
    street: z.string().min(1, "Street address is required"),
    country: z.string().min(1, "Country is required"),
    postcode: z.string().min(1, "Post code is required"),
    city: z.string().min(1, "City is required"),
    emergencyName: z.string().optional(),
    emergencyPhone: z.string().optional(),
    travelInsurance: z.string().refine((val) => val === "yes" || val === "no", {
      message: "Please select if you have travel insurance",
    }),
    insuranceProvider: z.string().optional(),
    policyNumber: z.string().optional(),
    additionalNote: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.travelInsurance === "yes") {
        return (
          data.insuranceProvider && data.insuranceProvider.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Insurance provider is required when you have travel insurance",
      path: ["insuranceProvider"],
    }
  )
  .refine(
    (data) => {
      if (data.travelInsurance === "yes") {
        return data.policyNumber && data.policyNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: "Policy number is required when you have travel insurance",
      path: ["policyNumber"],
    }
  );

// API response validation schema
export const tripBookingDataSchema = z.object({
  trips_two_id: z.number(),
  cabin_two_id: z.number(),
  number_of_members: z.number(),
  name: z.string().min(1),
  surname: z.string().min(1),
  gender: z.string().min(1),
  date_of_birth: z.string().min(1),
  mobile: z.string().min(1),
  email: z.string().email(),
  street_house_number: z.string().min(1),
  country: z.string().min(1),
  post_code: z.string().min(1),
  city_place_name: z.string().min(1),
  stay_at_home_contact: z.string().optional(),
  contact_no_home_caller: z.string().optional(),
  room_preference: z.string().min(1, "Room preference is required"), // ✅ required now
  travel_insurance: z.string().refine((val) => val === "yes" || val === "no", {
    message: "Please select if you have travel insurance",
  }),
  insured_at: z.string().optional(),
  policy_number: z.string().optional(),
  additional_note: z.string().optional(),
  terms_condition_check: z.boolean(),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type TripBookingDataValidated = z.infer<typeof tripBookingDataSchema>;
