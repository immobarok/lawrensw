"use client";

import React from "react";
import { useTranslatedPlaceholder } from '@/hook/useTranslation';


interface TranslatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholderKey: string;
  sourceLang?: string;
}

const TranslatedInput = ({
  placeholderKey,
  sourceLang = "en",
  ...props
}: TranslatedInputProps) => {
  const translatedPlaceholder = useTranslatedPlaceholder(
    placeholderKey,
    sourceLang
  );

  return <input {...props} placeholder={translatedPlaceholder} />;
};

export default TranslatedInput;
