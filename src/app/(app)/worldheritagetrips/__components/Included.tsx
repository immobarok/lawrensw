import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

interface IncludeItem {
  includes: string;
  excludes?: string;
}
interface IncludeItemProps {
  expeditionData: IncludeItem;
}
const Included: React.FC<IncludeItemProps> = ({ expeditionData }) => {
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
           What&apos;s included & excluded
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Included Items */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-4 flex items-center">
              <IoMdCheckmark className="mr-2 text-green-600" />
              Included in your expedition
            </h3>
            <ul className="space-y-3">
              {expeditionData.includes ? (
                expeditionData.includes
                  .replace(/<[^>]*>/g, "")
                  .split(/,|;/)
                  .map((item) => item.trim())
                  .filter((item) => item)
                  .map((item, index) => (
                    <li key={index} className="flex items-start">
                      <IoMdCheckmark className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))
              ) : (
                <li className="text-gray-500">
                  No inclusions information available
                </li>
              )}
            </ul>
          </div>

          {/* Excluded Items */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-4 flex items-center">
              <IoMdClose className="mr-2 text-red-600" />
              Excluded
            </h3>
            <ul className="space-y-3">
              {expeditionData.excludes ? (
                expeditionData.excludes
                  .replace(/<[^>]*>/g, "")
                  .split(/,|;/)
                  .map((item) => item.trim())
                  .filter((item) => item)
                  .map((item, index) => (
                    <li key={index} className="flex items-start">
                      <IoMdClose className="text-red-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))
              ) : (
                <li className="text-gray-500">
                  No exclusions information available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Included;
