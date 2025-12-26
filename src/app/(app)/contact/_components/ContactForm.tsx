"use client";

import Button from "@/components/ui/Button";
import { storeMessage } from "@/api/contact/contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslatedPlaceholder } from "@/hook/useTranslation";

// Define the form schema with zod
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const emailPlaceholder = useTranslatedPlaceholder("Enter your email");
  const namePlaceholder = useTranslatedPlaceholder("Enter your name");
  const phonePlaceholder = useTranslatedPlaceholder("Enter your phone number");
  const subjectPlaceholder = useTranslatedPlaceholder("Enter the subject");
  const messagePlaceholder = useTranslatedPlaceholder("Enter your message");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);

    try {
      await storeMessage(data);
      toast.success(
        "Message sent successfully! We'll reply within 1-2 business days."
      );
      reset();
    } catch (error: unknown) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200">
      <div className="mb-6 space-y-2 text-black">
        <h2 className="text-3xl font-bold">Get in touch with us</h2>
        <p className="text-gray-800">
          We&apos;ll reply within 1—2 business days.
        </p>
      </div>

      <form
        className="space-y-2 md:space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              className="mt-1 p-3.5 block w-full border border-gray-300 rounded-md text-gray-600 focus:ring-2 outline-none focus:ring-blue font-medium text-sm"
              placeholder={namePlaceholder}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 p-3.5 block w-full border border-gray-300 rounded-md text-gray-600 font-medium text-sm focus:ring-2 outline-none focus:ring-blue"
              placeholder={emailPlaceholder}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              {...register("phone")}
              type="text"
              className="mt-1 p-3.5 border block w-full border-gray-300 rounded-md text-gray-600 font-medium text-sm focus:ring-2 outline-none focus:ring-blue"
              placeholder={phonePlaceholder}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              {...register("subject")}
              type="text"
              className="mt-1 p-3.5 border block w-full border-gray-300 rounded-md text-gray-600 font-medium text-sm focus:ring-2 outline-none focus:ring-blue"
              placeholder={subjectPlaceholder}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            {...register("message")}
            rows={4}
            className="mt-1 p-4 block w-full border border-gray-300 rounded-md text-gray-600 font-medium text-sm focus:ring-2 outline-none focus:ring-blue"
            placeholder={messagePlaceholder}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-b from-secondary via-[#ffa33a] to-[#f3c086] text-sm font-semibold py-3.5 text-white"
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
