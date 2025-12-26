"use client";

import { useEffect } from "react";
import { getLogoAndFavicon } from "@/api/logo/logo";

export const useDynamicFavicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const logoData = await getLogoAndFavicon();
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
        } else {
          // Fallback to default favicon.ico if no favicon from API
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
        }
      } catch (error) {
        console.error("Failed to update favicon:", error);
        // Fallback to default favicon on error
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
      }
    };

    updateFavicon();
  }, []);
};
