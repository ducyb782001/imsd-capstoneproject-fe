import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import COMMON_EN from "../locales/en/common.json"
import COMMON_VI from "../locales/vi/common.json"
import MANAGEGOOD_EN from "../locales/en/manage-goods.json"
import MANAGEGOOD_VI from "../locales/vi/manage-goods.json"

const resources = {
  en: {
    common: COMMON_EN,
    manage_good: MANAGEGOOD_EN,
  },
  vi: {
    common: COMMON_VI,
    manage_good: MANAGEGOOD_VI,
  },
}

const defaultNS = "common"

i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  ns: ["common", "manage_good"],
  defaultNS,
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
})
