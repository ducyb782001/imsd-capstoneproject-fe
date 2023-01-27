import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { toast } from "react-toastify"

import cookie from "cookie"
import { loginUrl } from "../../constants/APIConfig"
import LeftBlockBackground from "./LeftBlockBackground"

function Login(props) {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()

  // useEffect(() => {
  //   const cookies = cookie.parse(window.document.cookie)
  //   if (cookies.token) {
  //     router.push("/dashboard")
  //   } else {
  //     router.push("/login")
  //   }
  // }, [cookie])

  // const loginMutation = useMutation(
  //   (login) => {
  //     return axios.post(loginUrl, login)
  //   },
  //   {
  //     onSuccess: (data, error, variables) => {
  //       if (typeof window !== "undefined") {
  //         const token = data?.data?.token
  //         const maxAge = data?.data?.expiresIn
  //         localStorage.setItem("token", token)
  //         window.document.cookie = cookie.serialize("token", token, {
  //           // maxAge: 30 * 24 * 60 * 60,
  //           maxAge: maxAge,
  //           path: "/",
  //         })
  //       }
  //       toast.success("Login successful!")
  //       setDisabled(true)
  //       setTimeout(() => {
  //         router.push("/")
  //       }, 300)
  //     },
  //     onError: (data: any) => {
  //       console.log("login error", data)
  //       toast.error(data?.response.data.message || data?.message)
  //     },
  //   },
  // )

  // const handleLogin = (event) => {
  //   event.preventDefault()
  //   // @ts-ignore
  //   loginMutation.mutate({
  //     email: userEmail,
  //     password: userPassword,
  //   })
  // }

  return (
    <div className="relative">
      <div className="absolute z-[2] hidden md:block">
        <LeftBlockBackground />
      </div>
      <div className="absolute grid items-center w-screen h-screen grid-cols-1 md:grid-cols-46 z-[5]">
        <LeftBlock />
        <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-white">
          <div className="min-w-full md:min-w-[440px]">
            <div className="text-2xl md:text-4xl">
              Welcome to Loyalty system
            </div>
            <p className="mt-4">Please log in to continue.</p>
            <div className="flex flex-col w-full gap-6 mt-11">
              <input
                placeholder="Enter your email"
                title="Email"
                onChange={(event) => setUserEmail(event.target.value)}
              />
              <input
                onChange={(event) => setUserPassword(event.target.value)}
              />
            </div>
            <div className="flex justify-end w-full mt-2">
              <p>Forgot Password</p>
            </div>
            {/* <button onClick={handleLogin} disabled={disabled} className="mt-11">
              Log in
            </button> */}
            {/* <p className="mt-6 text-center">
              Don't have an account? <p className="font-medium">Sign Up</p>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

export function LeftBlock() {
  return (
    <div className="relative hidden w-full h-full md:block">
      <div className="pt-20 pl-16 cursor-pointer">
        <img src="logo.svg" alt="logo" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 pr-40 mx-auto w-max">
        <img src="/images/menu-demo.png" alt="menu" className="" />
      </div>
    </div>
  )
}
