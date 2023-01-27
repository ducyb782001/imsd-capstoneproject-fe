import React, { useEffect } from "react"

function HorizontalNav(props) {
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
    <div className="fixed top-0 right-0 z-40 items-center justify-end hidden py-5 bg-white shadow-md dark:bg-slate-900 text-grayDark dark:text-white md:flex horizontal-nav-width pr-9">
      <button onClick={handleChangeTheme} className="mr-5">
        toggle
      </button>
    </div>
  )
}

export default HorizontalNav
