import { createContext, useContext, useState } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

type Language = "en" | "fr";

const translations = { en, fr };

const TranslationContext = createContext({
  language: "en",
  t: (key: string) => key,
  changeLanguage: (lang: Language) => {},
});

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => translations[language][key] || key;

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
	localStorage.setItem("language", lang);
  };

  return (
    <TranslationContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
