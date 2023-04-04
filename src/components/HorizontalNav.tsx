import React, { useEffect, useState } from "react"
import UserDropdown from "./UserDropdown"
import LanguageDropdown from "./Nav/LanguageDropdown"
import VnFlagIcon from "./icons/VnFlagIcon"
import { useTranslation } from "react-i18next"
import EngFlagIcon from "./icons/EngFlagIcon"

function HorizontalNav({ avatar = null, headTitle = "", userName = "" }) {
  const [showing, setShowing] = useState<any>()
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  useEffect(() => {
    if (i18n.language === "en") {
      setShowing({ id: 2, name: "English", code: "en", logo: <EngFlagIcon /> })
    } else if (i18n.language === "vi") {
      setShowing({
        id: 1,
        name: "Tiếng Việt",
        code: "vi",
        logo: <VnFlagIcon />,
      })
    }
  }, [i18n.language])

  return (
    <div className="fixed top-0 right-0 z-40 items-center justify-between hidden w-full py-5 bg-white md:flex horizontal-nav-width px-7">
      <div className="text-2xl font-semibold">{headTitle}</div>
      <div className="flex items-center gap-5">
        <LanguageDropdown showing={showing} changeLanguage={changeLanguage} />
        <UserDropdown avatar={avatar} userName={userName} />
      </div>
    </div>
  )
}

export default HorizontalNav
