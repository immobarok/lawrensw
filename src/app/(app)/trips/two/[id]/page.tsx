"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTripDetails } from "@/api/trip/AllTrips";

const TripTwoDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      const tripData = await getTripDetails(parseInt(id), "trip_two");
      setTrip(tripData);
      setLoading(false);
    };


    if (id) {
      fetchTripDetails();
    }
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading trip details...</div>;
  }

  if (!trip) {
    return <div className="p-4">Trip not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{trip.name}</h1>
      <p className="text-lg mb-4">Trip Type: Two</p>
      {/* Add more trip details here */}
    </div>
  );
};

export default TripTwoDetails;
