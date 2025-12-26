import { getAllpeopleBehindApi } from "@/api/about/about";
import DataError from "@/components/shared/DataError";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  image: string;
  alt_tag: string;
  designation: string;
  description: string;
}

// Helper function to extract data from API responses
const extractData = async (response: Response): Promise<unknown> => {
  try {
    const data = await response.json();
    const responseObj = data as Record<string, unknown>;

    if (!responseObj.status) return null;

    if (responseObj.data && Array.isArray(responseObj.data)) {
      return responseObj.data;
    }
    if (responseObj.data && typeof responseObj.data === "object") {
      return responseObj.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return responseObj.data || data;
  } catch (error) {
    console.error("Error extracting data:", error);
    return null;
  }
};

const TeamSection = async () => {
  let teamData: TeamMember[] = [];
  let error: string | null = null;

  try {
    const response = await getAllpeopleBehindApi();

    // Process team data
    const teamResult = await extractData(response);

    if (teamResult && Array.isArray(teamResult)) {
      teamData = teamResult as TeamMember[];
    } else {
      error = "Failed to fetch team data";
    }
  } catch (err) {
    error = "An error occurred while fetching team data";
    console.error(err);
  }

  if (error) {
    return <DataError />;
  }

  return (
    <div className="bg-white py-16 px-4 sm:px-6 ">
      <div className="container mx-auto text-start">
        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
          The People Behind the Trips
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          Experienced, passionate, and dedicated to making your journey
          unforgettable.
        </p>

        {/* Team Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamData.length > 0
            ? teamData.map((member) => (
                <div
                  key={member.id}
                  className="bg-dark rounded-xl shadow-sm p-6 text-center hover:shadow-md transition"
                >
                  <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden">
                    {member.image && member.image.trim() !== "" ? (
                      <Image
                        src={member.image}
                        alt={member.alt_tag}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="px-4 sm:px-8 md:px-12 lg:px-16">
                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">{member.designation}</p>
                    <p className="mt-2 text-gray-500 text-sm">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))
            : // Show placeholder cards if no data is available
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-dark rounded-xl shadow-sm p-6 text-center"
                >
                  <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="px-4 sm:px-8 md:px-12 lg:px-16">
                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      Team Member {item}
                    </h3>
                    <p className="text-gray-600">Designation</p>
                    <p className="mt-2 text-gray-500 text-sm">
                      Description not available
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
