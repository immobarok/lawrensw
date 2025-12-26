"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Logo = () => {
  const [logoUrl, setLogoUrl] = useState("/images/Frame 704.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/logo/retrive`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data?.status && data?.data?.data?.logo) {
          const logoPath = data.data.data.logo;
          const fullLogoUrl = logoPath.startsWith("http")
            ? logoPath
            : `${process.env.NEXT_PUBLIC_API_URL}/${logoPath}`;

          setLogoUrl(fullLogoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  if (loading) {
    return (
      <div className="w-36 md:w-82 h-16 bg-gray-200 animate-pulse rounded"></div>
    );
  }

  return (
    <div>
      <Image
        src={logoUrl}
        className="w-36 md:w-82 h-auto"
        width={295}
        height={64}
        alt="logo"
        priority
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src !== "/images/Frame 704.png") {
            target.src = "/images/Frame 704.png";
          }
        }}
      />
    </div>
  );
};

export default Logo;
