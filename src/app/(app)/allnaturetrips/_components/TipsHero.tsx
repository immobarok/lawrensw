const TipsHero = () => {
  return (
    <div className="relative">
      <div className="bg-[url('/natureTrips.jpg')] bg-cover bg-center h-[647px] flex items-center text-white overflow-hidden relative pb-20">
        <div className="container max-w-8xl mx-auto px-8  mt-20 md:mt-28 text-black">
          <p className=" font-medium mb-2 text-sm sm:text-base text-[#01357E]">
            Home / All expedition cruises
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
            Explore all Antarctic & Arctic expeditions
          </h1>
          <p className="text-lg max-w-lg text-blue-50">
            Browse our hand-picked polar adventures to Svalbard, Greenland,
            Antarctica and more.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TipsHero;
