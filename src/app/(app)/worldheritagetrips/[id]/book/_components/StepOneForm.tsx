import { IBooking } from "@/app/types/booking";

interface StepOneFormProps {
  formData: IBooking;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  step1Errors: Record<string, string>;
  shipName: string;
}

const StepOneForm = ({
  formData,
  handleChange,
  step1Errors,
  shipName,
}: StepOneFormProps) => {
  return (
    <div>
      <h1 className="text-xl font-semibold">Travel Information</h1>
      <div className="space-y-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-start md:gap-6">
          {/* Participants */}
          <div className="md:w-1/2">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Number of Participants
              <span className="text-red-500">*</span>
            </label>
            {step1Errors.participants && (
              <p className="text-red-500 text-sm mt-1">
                {step1Errors.participants}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {[1, 2, 3, 4].map((num) => (
                <label
                  key={num}
                  className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg hover:border-blue-300 transition-colors duration-200 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="participants"
                    value={num.toString()}
                    checked={formData.participants === num.toString()}
                    onChange={handleChange}
                    className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="text-gray-700 text-xs sm:text-sm md:text-base whitespace-nowrap">
                    {num} participant{num > 1 ? "s" : ""}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Travel Date */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <label
              htmlFor="travelDate"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Travel Date
            </label>
            <input
              id="travelDate"
              name="travelDate"
              type="text"
              defaultValue={formData.travelDate}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
          </div>
        </div>

        {/* Room Category & Ship Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {step1Errors.roomCategory && (
              <p className="text-red-500 text-sm mt-1">
                {step1Errors.roomCategory}
              </p>
            )}
            <label
              htmlFor="roomCategory"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Room Preference
              <span className="text-red-500">*</span>
            </label>
            <select
              id="roomCategory"
              name="roomCategory"
              value={formData.roomCategory}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Choose Option</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="shipName"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Ship Name
              <span className="text-red-500">*</span>
            </label>
            {step1Errors.shipName && (
              <p className="text-red-500 text-sm mt-1">
                {step1Errors.shipName}
              </p>
            )}
            <input
              id="shipName"
              name="shipName"
              type="text"
              value={formData.shipName}
              onChange={handleChange}
              placeholder="Enter ship name"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              readOnly={!!shipName}
            />
          </div>
        </div>

        {/* Your Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Your Information
          </h2>
          <p className="text-gray-600 mb-4">Participant 1</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                First Name(s) <span className="text-red-500">*</span>
              </label>
              {step1Errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {step1Errors.firstName}
                </p>
              )}
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="As per passport"
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label
                htmlFor="surname"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Surname <span className="text-red-500">*</span>
              </label>
              {step1Errors.surname && (
                <p className="text-red-500 text-sm mt-1">
                  {step1Errors.surname}
                </p>
              )}
              <input
                id="surname"
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Enter your surname"
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:gap-6">
          <div className="md:w-1/2">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Gender<span className="text-red-500">*</span>
            </label>
            {step1Errors.gender && (
              <p className="text-red-500 text-sm mt-1">{step1Errors.gender}</p>
            )}
            <div className="grid grid-cols-4 gap-4">
              {["male", "female"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700 font-medium">
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Date of Birth<span className="text-red-500">*</span>
            </label>
            {step1Errors.dob && (
              <p className="text-red-500 text-sm mt-1">{step1Errors.dob}</p>
            )}
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Mobile Number (During Travel)
              <span className="text-red-500">*</span>
            </label>
            {step1Errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{step1Errors.mobile}</p>
            )}
            <input
              id="mobile"
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Email Address<span className="text-red-500">*</span>
            </label>
            {step1Errors.email && (
              <p className="text red-500 text-sm mt-1">{step1Errors.email}</p>
            )}
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOneForm;
