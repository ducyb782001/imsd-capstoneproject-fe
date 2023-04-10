import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import HorizontalNav from "../HorizontalNav"
import MainNav from "./MainNav"
import cookie from "cookie"
import useGetMe from "../../hooks/useGetMe"
import { useTranslation } from "react-i18next"
import EngFlagIcon from "../icons/EngFlagIcon"
import VnFlagIcon from "../icons/VnFlagIcon"
function Layout({ headTitle = "", ...props }) {
  const router = useRouter()

  useEffect(() => {
    const cookies = cookie.parse(window.document.cookie)
    if (!cookies.token) {
      router.push("/login")
    }
  }, [cookie])

  const [userName, setUserName] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userNameCurrent = localStorage.getItem("userName")
      setUserName(userNameCurrent)
    }
  }, [])

  const { data } = useGetMe()
  const [showingLanguage, setShowingLanguage] = useState<any>()
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  useEffect(() => {
    if (i18n.language === "en") {
      setShowingLanguage({
        id: 2,
        name: "English",
        code: "en",
        logo: <EngFlagIcon />,
      })
    } else if (i18n.language === "vi") {
      setShowingLanguage({
        id: 1,
        name: "Tiếng Việt",
        code: "vi",
        logo: <VnFlagIcon />,
      })
    }
  }, [i18n.language])

  return (
    <div className="flex bg-[#F6F5FA] w-full">
      <MainNav
        userName={userName}
        changeLanguage={changeLanguage}
        showingLanguage={showingLanguage}
      />
      <HorizontalNav
        changeLanguage={changeLanguage}
        showingLanguage={showingLanguage}
        headTitle={headTitle}
        userName={userName}
        avatar={data?.image}
      />
      <div className="w-full min-h-screen pt-[44px] md:pt-[71px] md:pl-[276px]">
        <div className="flex flex-col justify-between w-full h-full px-4 pt-3 pb-6 md:p-7 text-grayDark">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Layout
