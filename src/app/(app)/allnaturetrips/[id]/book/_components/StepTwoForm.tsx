import { IBooking } from "@/app/types/booking";

interface StepTwoFormProps {
  formData: IBooking;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  step2Errors: Record<string, string>;
}

const StepTwoForm = ({
  formData,
  handleChange,
  step2Errors,
}: StepTwoFormProps) => {
  return (
    <div>
      <h1 className="text-xl font-semibold">
        Contact & Preferences Information
      </h1>
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="street" className="text-gray-800 font-semibold">
              Street Name & House Number
              <span className="text-red-500">*</span>
            </label>
            {step2Errors.street && (
              <p className="text-red-500 text-sm mt-1">{step2Errors.street}</p>
            )}
            <input
              id="street"
              name="street"
              type="text"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street address"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="country" className="text-gray-800 font-semibold">
              Country<span className="text-red-500">*</span>
            </label>
            {step2Errors.country && (
              <p className="text-red-500 text-sm mt-1">{step2Errors.country}</p>
            )}
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="postcode" className="text-gray-800 font-semibold">
              Post Code<span className="text-red-500">*</span>
            </label>
            {step2Errors.postcode && (
              <p className="text-red-500 text-sm mt-1">
                {step2Errors.postcode}
              </p>
            )}
            <input
              id="postcode"
              name="postcode"
              type="text"
              value={formData.postcode}
              onChange={handleChange}
              placeholder="Postal code"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="city" className="text-gray-800 font-semibold">
              City/Place Name<span className="text-red-500">*</span>
            </label>
            {step2Errors.city && (
              <p className="text-red-500 text-sm mt-1">{step2Errors.city}</p>
            )}
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="City/place name"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="emergencyName"
              className="text-gray-800 font-semibold"
            >
              Name of Stay-at-home Contact
            </label>
            {step2Errors.emergencyName && (
              <p className="text-red-500 text-sm mt-1">
                {step2Errors.emergencyName}
              </p>
            )}
            <input
              id="emergencyName"
              name="emergencyName"
              type="text"
              value={formData.emergencyName}
              onChange={handleChange}
              placeholder="Name"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="emergencyPhone"
              className="text-gray-800 font-semibold"
            >
              Contact Number of Home Caller
            </label>
            {step2Errors.emergencyPhone && (
              <p className="text-red-500 text-sm mt-1">
                {step2Errors.emergencyPhone}
              </p>
            )}
            <input
              id="emergencyPhone"
              name="emergencyPhone"
              type="text"
              value={formData.emergencyPhone}
              onChange={handleChange}
              placeholder="Home caller contact number"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            Do you have travel insurance?
            <span className="text-red-500">*</span>
          </label>
          {step2Errors.travelInsurance && (
            <p className="text-red-500 text-sm mt-1">
              {step2Errors.travelInsurance}
            </p>
          )}
          <div className="flex gap-6">
            {["yes", "no"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="travelInsurance"
                  value={option}
                  checked={formData.travelInsurance === option}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span className="text-gray-700 font-medium">
                  {option === "yes" ? "Yes" : "No"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {formData.travelInsurance === "yes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="insuranceProvider"
                className="text-gray-800 font-semibold"
              >
                Insured At (name of provider)
                <span className="text-red-500">*</span>
              </label>
              {step2Errors.insuranceProvider && (
                <p className="text-red-500 text-sm mt-1">
                  {step2Errors.insuranceProvider}
                </p>
              )}
              <input
                id="insuranceProvider"
                name="insuranceProvider"
                type="text"
                value={formData.insuranceProvider}
                onChange={handleChange}
                placeholder="Enter insurance provider name"
                className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label
                htmlFor="policyNumber"
                className="text-gray-800 font-semibold"
              >
                Policy Number
                <span className="text-red-500">*</span>
              </label>
              {step2Errors.policyNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {step2Errors.policyNumber}
                </p>
              )}
              <input
                id="policyNumber"
                name="policyNumber"
                type="text"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="Enter policy number"
                className="mt-2 w-full p-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="additionalNote"
            className="text-gray-800 font-semibold"
          >
            Additional Note
          </label>
          {step2Errors.additionalNote && (
            <p className="text-red-500 text-sm mt-1">
              {step2Errors.additionalNote}
            </p>
          )}
          <textarea
            id="additionalNote"
            name="additionalNote"
            rows={4}
            value={formData.additionalNote}
            onChange={handleChange}
            placeholder="Write your message"
            className="mt-2 w-full p-4 border border-gray-300 rounded-md text-gray-600 font-medium text-sm"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default StepTwoForm;
