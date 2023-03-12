import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import PrimaryInput from "../PrimaryInput"
import UnderlineText from "../UnderlineText"
import cookie from "cookie"
import { loginUrl } from "../../constants/APIConfig"
import LeftBlockBackground from "./LeftBlockBackground"
import { emailRegex } from "../../constants/constants"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function Login() {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [disabled, setDisabled] = useState(true)

  const router = useRouter()

  const loginMutation = useMutation(
    (login) => {
      return axios.post(loginUrl, login)
    },
    {
      onSuccess: (data, error, variables) => {
        if (typeof window !== "undefined") {
          const token = data?.data?.token
          const maxAge = data?.data?.expiresIn
          localStorage.setItem("token", token)
          window.document.cookie = cookie.serialize("token", token, {
            // maxAge: 30 * 24 * 60 * 60,
            maxAge: maxAge,
            path: "/",
          })
        }
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.success("Đăng nhập thành công!")
        setDisabled(true)
        setTimeout(() => {
          router.push("/")
        }, 300)
      },
      onError: (data: any) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.error("Email hoặc mật khẩu sai!")
      },
    },
  )

  const handleLogin = (event) => {
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    event.preventDefault()
    // @ts-ignore
    loginMutation.mutate({
      email: userEmail,
      password: userPassword,
    })
  }
  const handleSignUp = () => {
    router.push("/signup")
  }
  const handleForgotPass = () => {
    router.push("/input-forgot-email")
  }

  useEffect(() => {
    if (userEmail.trim() !== "" && userPassword.trim() !== "") {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  })

  return (
    <div className="relative">
      <div className="absolute z-[2] hidden md:block">
        <LeftBlockBackground />
      </div>
      <div className="absolute grid items-center w-screen h-screen grid-cols-1 md:grid-cols-46 z-[5]">
        <LeftBlock />
        <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-white">
          <div className="min-w-full md:min-w-[440px]">
            <div className="text-2xl md:text-4xl">Đăng nhập</div>
            <p className="mt-4">Chào mừng quay trở lại! Xin mời đăng nhập!</p>
            <div className="flex flex-col w-full gap-6 mt-11">
              <PrimaryInput
                title="Email"
                placeholder="Nhập email của bạn"
                onChange={(event) => setUserEmail(event.target.value)}
              />
              <PasswordInput
                title="Password"
                onChange={(event) => setUserPassword(event.target.value)}
              />
            </div>
            <div className="flex justify-end w-full mt-2 text-violet-500">
              <UnderlineText className="font-medium" onClick={handleForgotPass}>
                Quên mật khẩu?
              </UnderlineText>
            </div>
            <PrimaryBtn
              onClick={handleLogin}
              disabled={disabled}
              className="mt-11"
            >
              Đăng nhập
            </PrimaryBtn>
            <TextDescription className="mt-6 text-center">
              Chưa có tài khoản?{" "}
              <UnderlineText className="font-medium" onClick={handleSignUp}>
                Đăng kí
              </UnderlineText>
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
      <div className="pt-16 pl-16 cursor-pointer">
        <p className="text-3xl text-white">IMSD</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pr-40 mx-auto w-max">
        <img
          src="/images/AuthenticationLeftBar.png"
          alt="menu"
          className="w-2/5"
        />
      </div>
    </div>
  )
}
