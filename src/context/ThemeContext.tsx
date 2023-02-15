import React, { createContext, useContext, useEffect, useReducer } from "react"
import { changeSkeletonColor } from "../lib/change-css-variable"

type ContextType = {
  count: number
  handleChangeTheme: () => void
  dispatch: (s: string) => void
}
const initCount = 0

export const UP_ACTION = "up"
export const DOWN_ACTION = "down"

const ThemeContext = createContext<ContextType>({
  count: initCount,
  handleChangeTheme: () => {
    // comment for disable eslint error
  },
  dispatch: () => {
    // comment for disable eslint error
  },
})

const countReducer = (state: number, action: string) => {
  console.log("reducer running...")
  switch (action) {
    case UP_ACTION:
      return state + 1
    case DOWN_ACTION:
      return state - 1
    default:
      throw new Error("Invalid action")
  }
}

function ThemeProvier({ children }) {
  useEffect(() => {
    if (typeof window !== undefined) {
      // const currentTheme = localStorage.getItem("theme")
      // console.log(currentTheme)
      // if (
      //   currentTheme == "dark" ||
      //   (!currentTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
      // ) {
      //   document.documentElement.classList.add("dark")
      //   localStorage.setItem("theme", "dark")
      //   changeSkeletonColor("dark")
      // } else {
      //   document.documentElement.classList.remove("dark")
      //   localStorage.setItem("theme", "light")
      //   changeSkeletonColor("light")
      // }
      changeSkeletonColor("light")
    }
  }, [])

  const handleChangeTheme = () => {
    const currentTheme = localStorage.getItem("theme")
    if (currentTheme == "dark") {
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
      changeSkeletonColor("light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      changeSkeletonColor("dark")
    }
  }

  const [count, dispatch] = useReducer(countReducer, initCount)

  const contextValue = {
    count,
    dispatch,
    handleChangeTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

const useThemeContext = () => useContext(ThemeContext)

export { ThemeContext, ThemeProvier, useThemeContext }
