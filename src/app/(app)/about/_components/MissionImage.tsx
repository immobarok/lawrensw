"use client";

import Image from "next/image";
import { useState } from "react";

interface MissionImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc: string;
}

const MissionImage = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
}: MissionImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default MissionImage;
