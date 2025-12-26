import Image from "next/image";

interface ExpeditionData {
  name: string;
  finishing_city: string;
  feature_image: string;
  photos?: { url: string }[];
  destinations: {
    id: number;
    trip_id: number;
    name: string;
  }[];
}

interface TripTwoHeroProps {
  expeditionData: ExpeditionData;
}

const TripTwoHero: React.FC<TripTwoHeroProps> = ({ expeditionData }) => {
  const heroImage = expeditionData.feature_image;

  return (
    <div className="relative h-[50vh] md:h-[647px] overflow-hidden">
      <Image
        src={heroImage}
        alt={expeditionData.name}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/api/placeholder/1200/600";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
      <div className="relative container mx-auto px-6 h-full flex items-center">
        <div className="text-white max-w-full sm:max-w-2xl lg:max-w-4xl">
          <p className="flex items-center w-fit backdrop-blur-sm justify-start backdrop-brightness-90 gap-2 bg-white/30 px-8 py-2  text-white text-sm font-semibold rounded-full mb-3 sm:mb-4 sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 1.66699C11.9322 1.66699 8.06879 4.14023 6.45479 8.02131C4.9522 11.6345 5.76907 14.7137 7.45633 17.3367C8.8334 19.4775 10.8426 21.3885 12.6352 23.0934C12.9758 23.4174 13.3087 23.7339 13.6279 24.0433L13.63 24.0454C14.2664 24.6583 15.1163 25.0003 16 25.0003C16.8837 25.0003 17.7337 24.6583 18.3701 24.0453C18.6716 23.7549 18.9849 23.4579 19.3053 23.1543L19.3068 23.153C21.1185 21.4362 23.1553 19.5059 24.5468 17.3379C26.232 14.7123 27.046 11.63 25.5453 8.02131C23.9313 4.14023 20.0679 1.66699 16 1.66699ZM15.9993 8.00033C13.7901 8.00033 11.9993 9.79119 11.9993 12.0003C11.9993 14.2095 13.7901 16.0003 15.9993 16.0003C18.2085 16.0003 19.9993 14.2095 19.9993 12.0003C19.9993 9.79119 18.2085 8.00033 15.9993 8.00033Z"
                fill="#013A8A"
              />
              <path
                d="M7.99935 25C8.69428 25 9.26504 25.5316 9.3271 26.2104C9.35016 26.2357 9.38946 26.2737 9.45332 26.3241C9.69115 26.5115 10.1179 26.7387 10.7641 26.954C12.0426 27.3803 13.8936 27.6667 15.9993 27.6667C18.1051 27.6667 19.956 27.3803 21.2345 26.954C21.8808 26.7387 22.3075 26.5115 22.5453 26.3241C22.6092 26.2737 22.6485 26.2357 22.6716 26.2104C22.7336 25.5316 23.3044 25 23.9993 25C24.7357 25 25.3327 25.5969 25.3327 26.3333C25.3327 27.2852 24.7528 27.9797 24.196 28.4185C23.6241 28.8692 22.8793 29.2167 22.0779 29.4839C20.4609 30.0228 18.3119 30.3333 15.9993 30.3333C13.6868 30.3333 11.5378 30.0228 9.92086 29.4839C9.11935 29.2167 8.37455 28.8692 7.80274 28.4185C7.24595 27.9797 6.66602 27.2852 6.66602 26.3333C6.66602 25.5969 7.26298 25 7.99935 25Z"
                fill="#013A8A"
              />
            </svg>
            {expeditionData.destinations?.[0]?.name ||
              "Polar Your amazing expedition"}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            {expeditionData.name}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100">
            {expeditionData.destinations?.[0]?.name || "Polar destination"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripTwoHero;
