import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import COMMON_EN from "../locales/en/common.json"
import COMMON_VI from "../locales/vi/common.json"

const resources = {
  en: {
    common: COMMON_EN,
  },
  vi: {
    common: COMMON_VI,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  ns: ["common"],
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
})
