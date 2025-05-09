import { createContext, useContext, useState} from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import pt from "../locales/pt.json";
import kgt from "../locales/kgt.json";

export type Language = "en" | "fr" | "pt" | "kgt";

type Translations = Record<string, string>;

const translations: Record<Language, Translations> = { en, fr, pt, kgt };

interface TranslationContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  t: (key) => key,
  changeLanguage: () => {},
});

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang && ["en", "fr", "pt", "kgt"].includes(storedLang)) {
      return storedLang as Language;
    }
    return "en";
  });

  const t = (key: string, variables?: Record<string, string>) => {
    let translation = translations[language][key] || key;
  
    if (variables) {
      for (const [name, value] of Object.entries(variables)) {
        translation = translation.replace(`{{${name}}}`, value);
      }
    }
  
    return translation;
  };

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

export const useTranslation = (): TranslationContextType => useContext(TranslationContext);
