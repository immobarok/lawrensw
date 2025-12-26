const SectionTitle = ({ title, description }) => {
  return (
    <div className="mb-14 px-4">
      <h1 className="text-3xl lg:text-4xl xl:text-5xl text-left font-bold text-black mb-4 max-w-5xl">
        {title}
      </h1>
      <p className="text-[16px] md:text-[20px] text-gray max-w-3xl">{description}</p>
    </div>
  );
};

export default SectionTitle;
