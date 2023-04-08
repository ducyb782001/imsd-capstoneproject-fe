import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import HorizontalNav from "../HorizontalNav"
import MainNav from "./MainNav"
import cookie from "cookie"
import useGetMe from "../../hooks/useGetMe"
import BigNumber from "bignumber.js"
function Layout({ headTitle = "", ...props }) {
  const router = useRouter()

  useEffect(() => {
    const cookies = cookie.parse(window.document.cookie)
    if (!cookies.token) {
      router.push("/login")
    }
  }, [cookie])

  const [userName, setUserName] = useState("")
  const [roleId, setRoleId] = useState<number>()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userNameCurrent = localStorage.getItem("userName")
      const roleIdCurrent = localStorage.getItem("roleId")
      setUserName(userNameCurrent)
      setRoleId(new BigNumber(roleIdCurrent).toNumber())
    }
  }, [])

  const { data } = useGetMe()

  return (
    <div className="flex bg-[#F6F5FA] w-full">
      <MainNav userName={userName} />
      <HorizontalNav
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