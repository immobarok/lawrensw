import Link from "next/link";


const CTASection = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto ">
        <div className="rounded-3xl bg-gradient-to-r from-blue-200 via-blue-100 to-orange-200 p-12 text-center shadow-none py-22">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Ready to go on an expedition with us?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Join us on an unforgettable journey to some of Earth&apos;s most
            pristine and spectacular destinations.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href={"/allNatureTrips"}
              className="px-6 sm:px-12 md:px-16 py-2 md:py-2.5 bg-gradient-to-b cursor-pointer from-blue via-blue/90 to-[#89b8f8] text-white font-semibold rounded-md shadow hover:opacity-90 transition text-nowrap"
            >
              View all expeditions
            </Link>
            <Link
              href={"/contact"}
              className="px-10 md:px-14 py-2 md:py-2.5 border-2 cursor-pointer border-blue text-blue font-semibold rounded-md hover:bg-blue-50 transition text-nowrap"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
