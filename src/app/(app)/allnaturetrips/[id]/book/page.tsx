
import FAQ from "@/components/layout/Faq/FAQ";
import BookingForm from "./_components/BookingForm";

const Page = async () => {
  return (
    <div className="bg-[#F4F6F8]">
      <BookingForm />
      <div className="bg-dark">
        <FAQ />
      </div>
    </div>
  );
};

export default Page;
