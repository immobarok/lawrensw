"use client";

import { StaticImageData } from "next/image";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { assets } from "../../public/assets/assets";
import { translateText } from "@/api/translation/translation";

interface Language {
  code: string;
  name: string;
  flag: StaticImageData;
}

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

interface LanguageContextType {
  languages: Language[];
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  translateContent: (text: string, sourceLang?: string) => Promise<string>;
  isTranslating: boolean;
  translationCache: TranslationCache;
  clearTranslationCache: () => void;
  translatePageContent: () => Promise<void>;
  forceRefreshTranslation: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const languages = [
    { code: "en", name: "English", flag: assets.FlagUS },
    { code: "nl", name: "Dutch", flag: assets.FlagNED },
  ];

  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        const parsedLanguage = JSON.parse(savedLanguage);
        const foundLanguage = languages.find(
          (lang) => lang.code === parsedLanguage.code
        );
        if (foundLanguage) {
          console.log(`Initial language loaded: ${foundLanguage.code}`);
          return foundLanguage;
        }
      }
    }
    return languages[0];
  });

  const setCurrentLanguageWrapper = useCallback(
    (language: Language) => {
      console.log(
        `Setting language from ${currentLanguage.code} to ${language.code}`
      );

      // Store the new language in localStorage immediately
      localStorage.setItem("language", JSON.stringify({ code: language.code }));

      // Also set a cookie for server-side access
      document.cookie = `language=${language.code}; path=/; max-age=${
        60 * 60 * 24 * 365
      }`; // 1 year

      setCurrentLanguage(language);
    },
    [currentLanguage.code]
  );

  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<TranslationCache>(
    () => {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("translationCache");
        return cached ? JSON.parse(cached) : {};
      }
      return {};
    }
  );

  useEffect(() => {
    localStorage.setItem(
      "language",
      JSON.stringify({ code: currentLanguage.code })
    );

    // Also set cookie for server-side access
    if (typeof document !== "undefined") {
      document.cookie = `language=${currentLanguage.code}; path=/; max-age=${
        60 * 60 * 24 * 365
      }`; // 1 year
    }

    console.log(`Language changed to: ${currentLanguage.code}`);

    // Clear previous translations when language changes
    const allTranslatedElements =
      document.querySelectorAll("[data-translated]");
    allTranslatedElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.removeAttribute("data-translated");
    });

    // If switching to English, immediately restore original text
    if (currentLanguage.code === "en") {
      console.log("Switching to English, restoring original text");
      const translatedElements = document.querySelectorAll(
        "[data-original-text]"
      );
      translatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.dataset.originalText) {
          htmlElement.textContent = htmlElement.dataset.originalText;
          htmlElement.removeAttribute("data-translated");
        }
      });
    }
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem("translationCache", JSON.stringify(translationCache));
  }, [translationCache]);

  const clearTranslationCache = useCallback(() => {
    setTranslationCache({});
    localStorage.removeItem("translationCache");
  }, []);

  const translateContent = useCallback(
    async (text: string, sourceLang?: string): Promise<string> => {
      // Default source language is English
      const sourceLanguage = sourceLang || "en";
      const targetLanguage = currentLanguage.code;

      console.log(
        `Translating: "${text}" from ${sourceLanguage} to ${targetLanguage}`
      );

      // Return original text if same language
      if (sourceLanguage === targetLanguage) {
        console.log("Same language, returning original text");
        return text;
      }

      // Check cache first
      const cacheKey = text.trim();
      if (translationCache[cacheKey]?.[targetLanguage]) {
        console.log("Using cached translation");
        return translationCache[cacheKey][targetLanguage];
      }

      setIsTranslating(true);

      try {
        const result = await translateText(
          text,
          targetLanguage,
          sourceLanguage
        );

        if (result.success) {
          console.log(`Translation successful: "${result.translatedText}"`);
          // Update cache
          setTranslationCache((prev) => ({
            ...prev,
            [cacheKey]: {
              ...prev[cacheKey],
              [targetLanguage]: result.translatedText,
            },
          }));

          return result.translatedText;
        } else {
          console.error("Translation failed:", result.error);
          return text; // Return original text on failure
        }
      } catch (error) {
        console.error("Translation error:", error);
        return text; // Return original text on error
      } finally {
        setIsTranslating(false);
      }
    },
    [currentLanguage.code, translationCache]
  );

  const translatePageContent = useCallback(async () => {
    if (typeof window === "undefined") return;

    console.log(
      `translatePageContent called for language: ${currentLanguage.code}`
    );

    if (currentLanguage.code === "en") {
      console.log("Restoring original English text");
      const translatedElements = document.querySelectorAll(
        "[data-original-text]"
      );
      console.log(`Found ${translatedElements.length} elements to restore`);

      translatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.dataset.originalText) {
          console.log(`Restoring: "${htmlElement.dataset.originalText}"`);
          htmlElement.textContent = htmlElement.dataset.originalText;
          htmlElement.removeAttribute("data-translated");
        }
      });
      return;
    }

    // Get all text elements, including new ones from page navigation
    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, button, a, li,label"
    );

    console.log(
      `Found ${textElements.length} text elements to potentially translate`
    );

    // Use Promise.all to handle async operations properly
    const translationPromises = Array.from(textElements).map(
      async (element) => {
        const htmlElement = element as HTMLElement;
        const originalText = htmlElement.textContent?.trim();

        // Skip very short text and specific exclusions only
        if (
          originalText &&
          originalText.length > 2 &&
          !htmlElement.dataset.translated &&
          !htmlElement.closest("[data-no-translate]")
        ) {
          // Store original text
          if (!htmlElement.dataset.originalText) {
            htmlElement.dataset.originalText = originalText;
          }
          htmlElement.dataset.translated = "true";

          try {
            const translatedText = await translateContent(originalText, "en");
            if (translatedText !== originalText) {
              htmlElement.textContent = translatedText;
            }
          } catch (error) {
            console.error("Translation failed for:", originalText, error);
          }
        }
      }
    );

    await Promise.all(translationPromises);
  }, [translateContent, currentLanguage.code]);

  // Force refresh all translations
  const forceRefreshTranslation = useCallback(() => {
    console.log(
      `Force refreshing translation for language: ${currentLanguage.code}`
    );

    // Clear all translation markers
    const allElements = document.querySelectorAll("[data-translated]");
    allElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.removeAttribute("data-translated");
    });

    // Trigger translation
    setTimeout(() => {
      translatePageContent();
    }, 50);
  }, [currentLanguage.code, translatePageContent]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        console.log(`Auto-translating page to ${currentLanguage.code}`);
        translatePageContent();
      }, 300); // Reduced delay for faster response

      return () => clearTimeout(timer);
    }
  }, [currentLanguage.code, translatePageContent]);

  useEffect(() => {
    if (typeof window === "undefined" || currentLanguage.code === "en") return;

    const observer = new MutationObserver((mutations) => {
      let shouldTranslate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.TEXT_NODE ||
              (node.nodeType === Node.ELEMENT_NODE &&
                (node as Element).textContent?.trim())
            ) {
              shouldTranslate = true;
            }
          });
        }
      });

      if (shouldTranslate) {
        console.log("New content detected, triggering translation");
        setTimeout(() => {
          translatePageContent();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [currentLanguage.code, translatePageContent]);

  return (
    <LanguageContext.Provider
      value={{
        languages,
        currentLanguage,
        setCurrentLanguage: setCurrentLanguageWrapper,
        translateContent,
        isTranslating,
        translationCache,
        clearTranslationCache,
        translatePageContent,
        forceRefreshTranslation,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
