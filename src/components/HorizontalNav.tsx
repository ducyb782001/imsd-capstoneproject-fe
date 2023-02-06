import React, { useEffect } from "react"
import UserDropdown from "./UserDropdown"

function HorizontalNav({ headTitle = "" }) {
  // useEffect(() => {
  //   if (typeof window !== undefined) {
  //     console.log("ok")
  //     localStorage.setItem("theme", "light")
  //     console.log(window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   }
  // }, [])

  // const handleChangeTheme = () => {

  // }

  const handleChangeTheme = () => {
    const currentTheme = localStorage.getItem("theme")
    if (currentTheme == "dark") {
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  return (
    <div className="fixed top-0 right-0 z-40 items-center justify-between hidden w-full py-5 bg-white md:flex horizontal-nav-width px-7">
      <div className="text-2xl font-semibold">{headTitle}</div>
      <UserDropdown />
    </div>
  )
}

export default HorizontalNav
