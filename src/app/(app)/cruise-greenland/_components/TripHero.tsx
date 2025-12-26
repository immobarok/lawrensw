const TipsHero = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/exploreAllNatBanApi/index"
  );
  const response = await res.json();
  const data = response.data?.[0] || {};
  console.log("data", data);

  return (
    <div className="relative">
      <div
        className="bg-cover bg-center h-[647px] flex items-center text-white overflow-hidden relative pb-20"
        style={{ backgroundImage: `url('${data.image || ""}')` }}
      >
        <div className="container mx-auto px-4 pb-10">
          <div className=" md:ml-0  p-4 mt-28 text-black">
            <p className=" font-medium mb-2 text-sm sm:text-base text-[#01357E]">
              Home / All expedition cruises
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
              {data.header || "Explore all Antarctic & Arctic expeditions"}
            </h1>
            <p className="text-lg max-w-lg text-blue-50">
              {data.title ||
                "Browse our hand-picked polar adventures to Svalbard, Greenland, Antarctica and more."}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TipsHero;
