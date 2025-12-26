import {
  getReviews,
  getRatingData,
  getReviewHeader,
  ReviewData,
  RatingCalculation,
  HeaderData,
} from "@/api/rating/rating";
import ReviewSlider from "./ReviewSlide";
import DataError from "@/components/shared/DataError";

const Review = async () => {
  let reviews: ReviewData[] = [];
  let ratingData: RatingCalculation = {
    average: 0,
    count: 0,
  };
  let ratingHeader: HeaderData | null = null;
  let error: string | null = null;

  try {
    const [reviewsResponse, ratingDataResponse, headerResponse] =
      await Promise.all([getReviews(), getRatingData(), getReviewHeader()]);

    reviews = reviewsResponse;
    ratingData = ratingDataResponse;
    ratingHeader = headerResponse;
  } catch (err) {
    error = "Failed to fetch review data";
    console.error("Error fetching review data:", err);
  }

  if (error) {
    return <DataError />;
  }

  return (
    <ReviewSlider
      reviews={reviews}
      ratingData={ratingData}
      ratingHeader={ratingHeader}
    />
  );
};

export default Review;
