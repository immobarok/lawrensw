"use client";

import React from "react";
import { useTranslatedText } from "@/hook/useTranslation";

interface TranslatedTextProps {
  text: string;
  sourceLang?: string;
  className?: string;
  tag?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const TranslatedText = ({
  text,
  sourceLang = "en",
  className = "",
  tag: Tag = "span",
  children,
}: TranslatedTextProps) => {
  const translatedText = useTranslatedText(text, sourceLang);

  return (
    <Tag className={className} data-no-translate>
      {translatedText}
      {children}
    </Tag>
  );
};

export default TranslatedText;
