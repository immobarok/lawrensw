import React from "react";

const Loader = ({ message = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16 px-4">
      <div className="mt-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
      <p className="mt-4 text-blue text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loader;
