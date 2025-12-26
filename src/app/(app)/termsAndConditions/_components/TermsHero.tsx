const TermsHero = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="bg-[url('/terms&Conditions.png')] bg-cover bg-center h-[647px] flex flex-col items-start justify-center text-white text-start overflow-hidden">
        <div className="container max-w-8xl mx-auto p-4 md:p-0 mt-20 md:mt-28 text-black">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.2] md:leading-[1.3]">
            Terms and <br /> Conditions
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Please read these terms carefully before using our website or
            booking any trip.
          </p>
        </div>
      </div>
      {/* White Gradient Overlay at Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none"></div>
    </div>
  );
};
export default TermsHero;


