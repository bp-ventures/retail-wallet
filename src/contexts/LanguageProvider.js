import React, {
  useState,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { addItem, getItem } from "../lib/helpers/localStorageApp";

export const LanguageContext = createContext({
  language: "en",
  strings: {},
  updateLanguage: () => {},
});

export const LanguageProvider = ({ children, fetchTranslations }) => {
  const initialLocale = getItem("locale");
  const [{ language, strings }, setLanguage] = useState({
    language: initialLocale ? initialLocale : "en",
    strings: {},
  });
  const initialStringsLoaded = useRef(false);

  const updateLanguage = useCallback(
    async (newLang) => {
      if (initialStringsLoaded.current && newLang === language) return;
      const newStrings = await fetchTranslations({ language: newLang });
      initialStringsLoaded.current = true;
      setLanguage({
        language: newLang,
        strings: newStrings,
      });
      addItem("locale", newLang);
    },
    [language, fetchTranslations]
  );

  useEffect(() => {
    updateLanguage(language);
  }, [language, updateLanguage]);

  const context = {
    language,
    strings,
    updateLanguage: updateLanguage,
  };

  return (
    <LanguageContext.Provider value={context}>
      {children}
    </LanguageContext.Provider>
  );
};
