/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { en, type TranslationKey } from "@/i18n/en";
import { tr } from "@/i18n/tr";

export type { TranslationKey } from "@/i18n/en";

export type Language = "en" | "tr";

const languageStorageKey = "bridge-dashboard-language";

const translations = {
  en,
  tr,
} satisfies Record<Language, Record<TranslationKey, string>>;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  dateLocale: string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  if (storedLanguage === "en" || storedLanguage === "tr") {
    return storedLanguage;
  }

  return window.navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      dateLocale: language === "tr" ? "tr-TR" : "en-US",
      t: (key, params) => {
        const template = translations[language][key];
        if (!params) return template;

        return Object.entries(params).reduce(
          (message, [paramKey, paramValue]) =>
            message.replaceAll(`{${paramKey}}`, String(paramValue)),
          template,
        );
      },
    }),
    [language],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider.");
  }
  return context;
}
