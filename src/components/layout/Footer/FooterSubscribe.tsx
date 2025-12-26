import { IoIosRocket } from "react-icons/io";
import { useState } from "react";
import { subscribe } from "@/api/subscriptions/subscriptions";
import { toast } from "sonner";

const FooterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await subscribe(email.trim());
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-3xl lg:flex-1">
          <h2 className="text-blue text-[56px] font-bold mb-6">
            Join our Polar Traveler community
          </h2>
          <p className="text-gray text-[20px] font-normal ">
            Be the first to hear about our latest expedition cruises and polar
            news. From Svalbard to Greenland to the Antarctic. Sign up for our
            newsletter — no spam, just pure inspiration.
          </p>
        </div>
        <div className="lg:flex-shrink-0 lg:w-[48rem]">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                className="h-12 px-6 w-full border text-gray-800 border-gray-500/30 rounded-[8px] outline-none focus:border-indigo-300 bg-white"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="flex items-center justify-center py-2.5 gap-2.5 text-white bg-[#013a8a] px-6 text-[18px] font-bold rounded-[8px] disabled:opacity-90 disabled:cursor-not-allowed"
              >
                <IoIosRocket size={24} />
                <span>{loading ? "Subscribing..." : "Subscribe"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-[#B0C2DB] border-0 rounded-sm my-15" />
    </div>
  );
};

export default FooterSubscribe;
