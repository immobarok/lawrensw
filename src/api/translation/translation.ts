
// Translation API response interface based on your backend response
export interface TranslationResponse {
  status: boolean;
  message: string;
  data: {
    translatedText: string;
    detectedSource: string;
  };
  code: number;
}

// Translation request parameters
export interface TranslationParams {
  text: string;
  target: string;
  source: string;
}

// Error interface for translation failures
export interface TranslationError {
  message: string;
  status: number;
}

/**
 * Translate text using the backend translation API
 * @param text - The text to translate
 * @param target - Target language code (e.g., 'nl', 'en')
 * @param source - Source language code (e.g., 'en', 'nl')
 * @returns Promise with translated text or error
 */
export const translateText = async (
  text: string,
  target: string,
  source: string
): Promise<
  | { success: true; translatedText: string; detectedSource: string }
  | { success: false; error: string }
> => {
  try {
    // Don't translate if source and target are the same
    if (source === target) {
      return {
        success: true,
        translatedText: text,
        detectedSource: source,
      };
    }

    // Don't translate empty text
    if (!text.trim()) {
      return {
        success: true,
        translatedText: text,
        detectedSource: source,
      };
    }

    const response = await fetch(
      `/api/translate?text=${encodeURIComponent(
        text
      )}&target=${target}&source=${source}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Translation failed",
      };
    }

    const data = await response.json();

    // Check if the backend response indicates success
    if (!data.status) {
      return {
        success: false,
        error: data.message || "Translation service returned an error",
      };
    }

    return {
      success: true,
      translatedText: data.data.translatedText,
      detectedSource: data.data.detectedSource,
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown translation error",
    };
  }
};

/**
 * Batch translate multiple texts
 * @param texts - Array of texts to translate
 * @param target - Target language code
 * @param source - Source language code
 * @returns Promise with array of translation results
 */
export const translateBatch = async (
  texts: string[],
  target: string,
  source: string
): Promise<
  Array<{
    original: string;
    translated: string;
    success: boolean;
    error?: string;
  }>
> => {
  const results = await Promise.allSettled(
    texts.map(async (text) => {
      const result = await translateText(text, target, source);
      return {
        original: text,
        translated: result.success ? result.translatedText : text,
        success: result.success,
        error: result.success ? undefined : result.error,
      };
    })
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        original: texts[index],
        translated: texts[index],
        success: false,
        error: "Translation request failed",
      };
    }
  });
};

/**
 * Get supported language pairs
 */
export const getSupportedLanguages = () => {
  return {
    en: "English",
    nl: "Nederlands",
  };
};

export const isLanguageSupported = (languageCode: string): boolean => {
  const supported = getSupportedLanguages();
  return languageCode in supported;
};
