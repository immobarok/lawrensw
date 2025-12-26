import {
  getRatingData,
  getReviews,
  getReviewHeader,
} from "@/api/rating/rating";
import ReviewSlider from "./ReviewSlide";

const ReviewSection = async () => {
  try {
    // Fetch reviews, rating data, and header in parallel on the server
    const [reviewsResponse, ratingDataResponse, headerResponse] =
      await Promise.all([getReviews(), getRatingData(), getReviewHeader()]);

    //console.log("HIH", reviewsResponse);

    // Pass the fetched data to the client component for rendering
    return (
      <ReviewSlider
        reviews={reviewsResponse}
        ratingData={ratingDataResponse}
        ratingHeader={headerResponse}
      />
    );
  } catch (error) {
    console.error("Failed to fetch review data:", error);
    // You can render a fallback or null if the data isn't critical
    return (
      <div className="text-center py-10">
        <p>Could not load reviews at this time.</p>
      </div>
    );
  }
};

export default ReviewSection;
