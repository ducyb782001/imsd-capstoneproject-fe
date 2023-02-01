import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import LeftBlockBackground from "./LeftBlockBackground"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import UnderlineText from "../UnderlineText"
import PrimaryInput from "../PrimaryInput"

function Login(props) {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()


  const handleLogin = (event) => {
    event.preventDefault()
    // @ts-ignore
    loginMutation.mutate({
      email: userEmail,
      password: userPassword,
    })
  }
  const handleForgot = (event) => {
    router.push("/login")
  }
const handleSignUp = (event) => {
  router.push("/signup")
  }
  const handleForgotPass = (event) => {
    router.push("/forgotPassword")
    }
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
              Login
            </div>
            <p className="mt-4">Welcome back! Please enter your details.</p>
            <div className="flex flex-col w-full gap-6 mt-11">
              <PrimaryInput
                title="Email"
                placeholder="Enter your email"
                onChange={(event) => setUserEmail(event.target.value)}
              />
              <PasswordInput
                onChange={(event) => setUserPassword(event.target.value)}
              />
            </div>
            <div className="flex justify-end w-full mt-2 text-violet-500">
              <UnderlineText className="font-medium" onClick={handleForgotPass}>Forgot Password</UnderlineText>
            </div>
            <PrimaryBtn
              onClick={handleLogin}
              disabled={disabled}
              className="mt-11"
            >
              Log in
            </PrimaryBtn>
            <TextDescription className="mt-6 text-center">
              Don't have an account?{" "}
              <UnderlineText className="font-medium" onClick={handleSignUp}>Sign Up</UnderlineText>
            </TextDescription>

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
