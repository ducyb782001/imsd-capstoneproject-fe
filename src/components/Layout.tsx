import { useRouter } from "next/router"
import React, { useEffect } from "react"
import HorizontalNav from "./HorizontalNav"
import MainNav from "./MainNav"
import cookie from "cookie"
import useGetMe from "../hooks/useGetMe"

function Layout({ headTitle = "", ...props }) {
  const router = useRouter()

  useEffect(() => {
    const cookies = cookie.parse(window.document.cookie)
    if (!cookies.token) {
      router.push("/login")
    }
  }, [cookie])

  const { data } = useGetMe()

  return (
    <div className="flex bg-[#F6F5FA] w-full">
      <MainNav userName={data?.userName} roleId={data?.roleId} />
      <HorizontalNav headTitle={headTitle} userName={data?.userName} />
      <div className="w-full min-h-screen pt-[44px] md:pt-[71px] md:pl-[276px]">
        <div className="flex flex-col justify-between w-full h-full px-4 pt-3 pb-6 md:p-7 text-grayDark">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Layout
