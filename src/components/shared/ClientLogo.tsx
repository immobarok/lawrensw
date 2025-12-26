"use client";

import Image from "next/image";
import { useState } from "react";

interface ClientLogoProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

const ClientLogo = ({
  src,
  alt,
  className,
  width,
  height,
  fallbackSrc = "/images/Frame 704.png",
}: ClientLogoProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div>
      <Image
        src={imgSrc}
        className={className}
        width={width}
        height={height}
        alt={alt}
        onError={() => setImgSrc(fallbackSrc)}
      />
    </div>
  );
};

export default ClientLogo;
