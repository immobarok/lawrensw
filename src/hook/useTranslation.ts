"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface UseTranslationOptions {
  autoTranslate?: boolean;
  sourceLang?: string;
  cacheKey?: string;
}

interface TranslationResult {
  text: string;
  isLoading: boolean;
  error: string | null;
  retranslate: () => void;
}


export const useTranslation = (
  originalText: string,
  options: UseTranslationOptions = {}
): TranslationResult => {
  const { autoTranslate = true, sourceLang, cacheKey } = options;
  const { currentLanguage, translateContent, isTranslating } = useLanguage();

  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performTranslation = async () => {
    if (!originalText.trim()) {
      setTranslatedText(originalText);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await translateContent(originalText, sourceLang);
      setTranslatedText(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
      setTranslatedText(originalText);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoTranslate) {
      performTranslation();
    } else {
      setTranslatedText(originalText);
    }
  }, [originalText, currentLanguage.code, autoTranslate, sourceLang]);

  return {
    text: translatedText,
    isLoading: isLoading || isTranslating,
    error,
    retranslate: performTranslation,
  };
};

export const useTranslatedText = (
  text: string,
  sourceLang?: string
): string => {
  const { text: translatedText } = useTranslation(text, {
    autoTranslate: true,
    sourceLang,
  });
  return translatedText;
};

export const useBatchTranslation = (
  texts: string[],
  sourceLang?: string
): { translatedTexts: string[]; isLoading: boolean; error: string | null } => {
  const { currentLanguage, translateContent } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const translateAll = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          texts.map((text) => translateContent(text, sourceLang))
        );
        setTranslatedTexts(results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Batch translation failed"
        );
        setTranslatedTexts(texts); 
      } finally {
        setIsLoading(false);
      }
    };

    translateAll();
  }, [texts, currentLanguage.code, sourceLang, translateContent]);

  return { translatedTexts, isLoading, error };
};


export const useTranslatedPlaceholder = (
  placeholderText: string,
  sourceLang?: string
): string => {
  const { currentLanguage, translateContent } = useLanguage();
  const [translatedPlaceholder, setTranslatedPlaceholder] =
    useState(placeholderText);

  useEffect(() => {
    const translatePlaceholder = async () => {
      if (!placeholderText.trim()) {
        setTranslatedPlaceholder(placeholderText);
        return;
      }

      try {
        const result = await translateContent(placeholderText, sourceLang);
        setTranslatedPlaceholder(result);
      } catch (err) {
        setTranslatedPlaceholder(placeholderText);
      }
    };

    translatePlaceholder();
  }, [placeholderText, currentLanguage.code, sourceLang, translateContent]);

  return translatedPlaceholder;
};
