import { createContext, useContext, useState } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import pt from "../locales/pt.json";
import kgt from "../locales/kgt.json";

type Language = "en" | "fr" | "pt" | "kgt";

const translations = { en, fr, pt, kgt };

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
