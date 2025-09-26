import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import viLanguage from "../../public/languages/vi-language.json";
import enLanguage from "../../public/languages/en-language.json";

i18n
  .use(initReactI18next)
  .init({
    lng: "vi", // ngôn ngữ mặc định
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
    vi: { translation: viLanguage },
    en: { translation: enLanguage },
  },
  });

export default i18n;
