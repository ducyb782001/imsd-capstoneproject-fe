import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import cookie from "cookie"
import { DEPOSIT_GUIDE_KEY } from "../constants/constants"
import { useRouter } from "next/router"

type ContextType = {
  isLogin: boolean
  userEmail: string
  checkLogin: () => void
  handleLogout: () => void
  toggleModalLogin: () => void
  isOpenModalLogin: boolean
  isCreatedProfile: boolean
  isLinkedEmaiAddress: boolean
  checkCreatedProfile: () => void
  checkLinkedEmailAddress: () => void
  getUserEmail: () => void
}

const AuthContext = createContext<ContextType>({
  isLogin: false,
  userEmail: "",
  checkLogin: () => null,
  handleLogout: () => null,
  toggleModalLogin: () => null,
  isOpenModalLogin: false,
  isCreatedProfile: true,
  isLinkedEmaiAddress: true,
  checkCreatedProfile: () => null,
  checkLinkedEmailAddress: () => null,
  getUserEmail: () => null,
})

function AuthProvier({ children }) {
  const [isLogin, setIsLogin] = useState(false)
  const [userEmail, setUserEmail] = useState<string>()
  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false)

  const { connector } = useWeb3React<Web3Provider>()
  const [isCreatedProfile, setIsCreatedProfile] = useState(true)
  const [isLinkedEmaiAddress, setIsLinkedEmaiAddress] = useState(true)
  const router = useRouter()
  const handleLogout = () => {
    if (connector?.deactivate) {
      connector.deactivate()
    } else {
      connector.resetState()
    }
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key !== DEPOSIT_GUIDE_KEY) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    window.document.cookie = cookie.serialize("accessToken", "", {
      maxAge: -1, // Expire the accessToken immediately.
      path: "/",
    })
    window.document.cookie = cookie.serialize("refreshToken", "", {
      maxAge: -1, // Expire the refreshToken immediately.
      path: "/",
    })
    router.reload()
  }

  const checkLogin = () => {
    const cookies = cookie.parse(window.document.cookie)
    cookies?.refreshToken ? setIsLogin(true) : setIsLogin(false)
  }

  const getUserEmail = () => {
    const email = localStorage?.getItem("userEmail")
    setUserEmail(email)
  }

  const toggleModalLogin = () => {
    setIsOpenModalLogin(!isOpenModalLogin)
  }

  const checkCreatedProfile = () => {
    const isCreatedProfile = localStorage.getItem("isCreateProfile")
    if (isCreatedProfile === "false") {
      setIsCreatedProfile(false)
    } else {
      setIsCreatedProfile(true)
    }
  }

  const checkLinkedEmailAddress = () => {
    const isLinkedEmaiAddress = localStorage.getItem("isLinkedWithEmaiAddress")
    if (isLinkedEmaiAddress === "false") {
      setIsLinkedEmaiAddress(false)
    } else {
      setIsLinkedEmaiAddress(true)
    }
  }

  useEffect(() => {
    checkLogin()
    getUserEmail()
    checkCreatedProfile()
    checkLinkedEmailAddress()
  }, [])

  const contextValue = useMemo(() => {
    return {
      isLogin,
      userEmail,
      checkLogin,
      handleLogout,
      toggleModalLogin,
      isOpenModalLogin,
      isCreatedProfile,
      isLinkedEmaiAddress,
      checkCreatedProfile,
      checkLinkedEmailAddress,
      getUserEmail,
    }
  }, [isLogin, userEmail, isOpenModalLogin, isLinkedEmaiAddress, isCreatedProfile])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

const useAuthContext = () => useContext(AuthContext)

export { AuthContext, AuthProvier, useAuthContext }
