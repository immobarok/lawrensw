"use client";

import { useEffect } from "react";
import { getLogoAndFavicon } from "@/api/logo/logo";

const DynamicFavicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const logoData = await getLogoAndFavicon();
        //console.log("LogoData",logoData);

        if (logoData?.favicon) {
          // Update favicon
          let favicon = document.querySelector(
            'link[rel="icon"]'
          ) as HTMLLinkElement;

          if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            favicon.type = "image/x-icon";
            document.head.appendChild(favicon);
          }

          favicon.href = logoData.favicon;

          // Also update apple-touch-icon for better mobile support
          let appleTouchIcon = document.querySelector(
            'link[rel="apple-touch-icon"]'
          ) as HTMLLinkElement;
          if (!appleTouchIcon) {
            appleTouchIcon = document.createElement("link");
            appleTouchIcon.rel = "apple-touch-icon";
            document.head.appendChild(appleTouchIcon);
          }
          appleTouchIcon.href = logoData.favicon;

          // Update shortcut icon as well
          let shortcutIcon = document.querySelector(
            'link[rel="shortcut icon"]'
          ) as HTMLLinkElement;
          if (!shortcutIcon) {
            shortcutIcon = document.createElement("link");
            shortcutIcon.rel = "shortcut icon";
            shortcutIcon.type = "image/x-icon";
            document.head.appendChild(shortcutIcon);
          }
          shortcutIcon.href = logoData.favicon;

          //console.log("Favicon updated successfully:", logoData.favicon);
        } else {
          //console.log("No favicon data received from API");
          setDefaultFavicon();
        }
      } catch (error) {
        console.error("Failed to update favicon:", error);
        setDefaultFavicon();
      }
    };

    const setDefaultFavicon = () => {
      // Fallback to default favicon.ico if API fails
      let favicon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement;

      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        
        favicon.type = "image/x-icon";
        document.head.appendChild(favicon);
      }

      favicon.href = "/favicon.ico";
      console.log("Using default favicon");
    };

    updateFavicon();
  }, []);

  return null; // This component doesn't render anything visible
};

export default DynamicFavicon;
