import { HiUser } from "react-icons/hi";
import { MdContactPage } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";

interface StepperProps {
  step: number;
  maxStep: number;
  setStep: (step: number) => void;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Stepper = ({
  step,
  maxStep,
  setStep,
  handleSliderChange,
}: StepperProps) => {
  return (
    <div className="bg-dark p-4 sm:p-6 md:p-8 my-4 sm:my-6 rounded-xl md:rounded-2xl">
      {/* Progress Bar */}
      <div className="relative mb-6 md:mb-8">
        <input
          id="step-range"
          type="range"
          min={1}
          max={maxStep}
          value={step}
          onChange={handleSliderChange}
          className="w-full h-1.5 sm:h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #013A8A ${
              ((step - 1) / (maxStep - 1)) * 100
            }%, #e5e7eb ${((step - 1) / (maxStep - 1)) * 100}%)`,
          }}
        />
      </div>

      {/* Step Labels with Icons */}
      <div className="flex justify-between items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {/* Step 1 */}
        <div
          className="flex flex-col items-center justify-start flex-1 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] cursor-pointer"
          onClick={() => setStep(1)}
        >
          <div
            className={`p-2 sm:p-3 rounded-full mb-2 sm:mb-3 transition-all duration-300 ${
              step >= 1 ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <HiUser
              className={`${
                step >= 1 ? "text-blue" : "text-gray-400"
              } transition-colors duration-300 text-lg sm:text-xl md:text-2xl`}
              size={24}
            />
          </div>
          <p
            className={`text-[10px] xs:text-xs sm:text-sm font-medium text-center transition-colors duration-300 leading-tight ${
              step >= 1 ? "text-blue font-semibold" : "text-gray-500"
            }`}
          >
            Travel & Personal Info
          </p>
          {step === 1 && (
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue rounded-full mt-1 sm:mt-2 animate-pulse"></div>
          )}
        </div>

        {/* Step 2 */}
        <div
          className="flex flex-col items-center justify-start flex-1 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] cursor-pointer"
          onClick={() => step >= 2 && setStep(2)}
        >
          <div
            className={`p-2 sm:p-3 rounded-full mb-2 sm:mb-3 transition-all duration-300 ${
              step >= 2 ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <MdContactPage
              className={`${
                step >= 2 ? "text-blue" : "text-gray-400"
              } transition-colors duration-300 text-lg sm:text-xl md:text-2xl`}
              size={24}
            />
          </div>
          <p
            className={`text-[10px] xs:text-xs sm:text-sm font-medium text-center transition-colors duration-300 leading-tight ${
              step >= 2 ? "text-blue font-semibold" : "text-gray-500"
            }`}
          >
            Contact & Preferences
          </p>
          {step === 2 && (
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue rounded-full mt-1 sm:mt-2 animate-pulse"></div>
          )}
        </div>

        {/* Step 3 */}
        <div
          className="flex flex-col items-center justify-start flex-1 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] cursor-pointer"
          onClick={() => step >= 3 && setStep(3)}
        >
          <div
            className={`p-2 sm:p-3 rounded-full mb-2 sm:mb-3 transition-all duration-300 ${
              step >= 3 ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <IoCheckmarkDone
              className={`${
                step >= 3 ? "text-blue" : "text-gray-400"
              } transition-colors duration-300 text-lg sm:text-xl md:text-2xl`}
              size={24}
            />
          </div>
          <p
            className={`text-[10px] xs:text-xs sm:text-sm font-medium text-center transition-colors duration-300 leading-tight ${
              step >= 3 ? "text-blue font-semibold" : "text-gray-500"
            }`}
          >
            Review & Submit
          </p>
          {step === 3 && (
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue rounded-full mt-1 sm:mt-2 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
