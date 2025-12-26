import { useState, useEffect } from "react";
import { assets } from "../../../../../public/assets/assets";
import Image from "next/image";
import { BookingStatus, userBookingList } from "@/api/profile/profile";
import Loader from "@/components/shared/Loader";
import { formatTourDateRange } from "@/app/lib/formatTourDateRange";

interface Booking {
  id: number;
  trip_code: string;
  code: string;
  status: BookingStatus;
  total_amount: string;
  number_of_members: number;
  created_at: string;
  trip: {
    id: number;
    name: string;
    feature_image: string;
    departure_date: string;
    return_date: string;
  };
  cabin: {
    name: string;
    image: string;
  };
}

const TripsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<BookingStatus>("approved");

  useEffect(() => {
    fetchBookings(selectedStatus);
  }, [selectedStatus]);

  const fetchBookings = async (status: BookingStatus) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userBookingList(status);
      console.log("trips", response);

      if (response.success && response.data) {
        // Type-safe access to nested data
        const responseData = response.data as unknown;
        if (
          responseData &&
          typeof responseData === "object" &&
          "data" in responseData
        ) {
          const nestedData = (responseData as { data: unknown }).data;
          if (
            nestedData &&
            typeof nestedData === "object" &&
            "bookings" in nestedData
          ) {
            setBookings((nestedData as { bookings: Booking[] }).bookings || []);
          } else {
            setBookings([]);
          }
        } else {
          setBookings([]);
        }
      } else {
        setError(
          (response as { message?: string }).message ||
            "Failed to fetch bookings"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: { value: BookingStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (loading) {
    return <Loader message="Loading..." />;
  }

  if (error) {
    return (
      <div className="bg-white h-fit py-6 px-4 rounded-2xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Trips</h1>
          <div className="flex justify-center items-center h-40">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-fit py-6 px-4 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by:
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as BookingStatus)
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-600">No {selectedStatus} bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div
                key={`${booking.code || booking.trip_code}-${index}`}
                className="flex flex-col md:flex-row gap-4 bg-[#FFF4E8] p-4 rounded-lg shadow-sm border border-amber-100"
              >
                {/* Image - Use trip image from API */}
                <div className="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={booking.trip?.feature_image || assets.g1.src}
                    alt={booking.trip?.name || `Booking #${booking.id}`}
                    width={128}
                    height={128}
                    className="w-38 h-full object-cover object-center"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Status Label */}
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded inline-block mb-2 ${
                      booking.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>

                  {/* Trip Name */}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {booking.trip?.name || `Booking #${booking.id}`}
                  </h2>

                  {/* Cabin Type */}
                  <p className="text-sm text-gray-700 mt-1">
                    {booking.total_amount || "Not specified"}
                  </p>

                  {/* Travel Dates */}
                  {booking.trip?.departure_date &&
                    booking.trip?.return_date && (
                      <p className="text-sm text-gray-600 mt-1">
                        Our tour from{" "}
                        {formatTourDateRange(
                          booking.trip.departure_date,
                          booking.trip.return_date
                        )}
                        {""} has ended!
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
