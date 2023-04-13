import React from "react"
import UserDropdown from "./UserDropdown"
import LanguageDropdown from "./Nav/LanguageDropdown"

function HorizontalNav({ avatar = null, headTitle = "", userName = "" }) {
  return (
    <div className="fixed top-0 right-0 z-40 items-center justify-between hidden w-full py-5 bg-white md:flex horizontal-nav-width px-7">
      <div className="text-2xl font-semibold">{headTitle}</div>
      <div className="flex items-center gap-10">
        <LanguageDropdown />
        <UserDropdown avatar={avatar} userName={userName} />
      </div>
    </div>
  )
}

export default HorizontalNav
