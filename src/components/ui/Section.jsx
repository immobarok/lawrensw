const Section = ({ children, className = "", ...props }) => {
  return (
    <div className={`container mx-auto py-20 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Section;
