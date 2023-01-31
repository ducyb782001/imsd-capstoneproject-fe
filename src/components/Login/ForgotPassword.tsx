import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import LeftBlockBackground from "./LeftBlockBackground"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import UnderlineText from "../UnderlineText"
import PrimaryInput from "../PrimaryInput"

function ForgotPassword(props) {
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
  return (
    <div className="">

    </div>
  )
}

export default ForgotPassword