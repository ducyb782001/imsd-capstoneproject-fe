import { useRouter } from "next/router"
import React from "react"
import Footer from "./Footer"
import HorizontalNav from "./HorizontalNav"
import MainNav from "./MainNav"

function Layout({ headTitle = "", ...props }) {
  const router = useRouter()
  return (
    <div className="flex bg-[#F6F5FA] w-full">
      <MainNav />
      <HorizontalNav headTitle={headTitle} />
      <div className="w-full min-h-screen pt-[44px] md:pt-[71px] md:pl-[276px]">
        <div className="flex flex-col justify-between w-full h-full px-4 pt-3 pb-6 md:p-7 text-grayDark">
          {props.children}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  )
}

export default Layout
