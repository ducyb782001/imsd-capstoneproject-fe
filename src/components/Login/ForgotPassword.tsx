import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import UnderlineText from "../UnderlineText"
import PrimaryInput from "../PrimaryInput"
import Title from "../Title"
import EmailSendingIcon from "../icons/EmailSendingIcon"
import ArrowLeftIcon from "../icons/ArrowLeftIcon"
import LeftBlockBackground from "./LeftBlockBackground"
import { LeftBlock } from "./Login"

function ForgotPassword(props) {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()

  const handleLogin = (event) => {
    router.push("/login")
  }
  const handleForgot = (event) => {
    router.push("/login")
  }
  const handleSignUp = (event) => {
    router.push("/signup")
  }
  return (
    <div className="relative">
      <div className="absolute z-[2]">
        <LeftBlockBackground />
      </div>

      <div className="absolute grid items-center w-screen h-screen grid-cols-46 z-[5]">
        <LeftBlock />
        <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-[#F6F5FA]">
          <div className="flex flex-col items-center justify-center w-full h-full px-4 ">
            <div className="min-w-[440px] mt-6 flex flex-col items-center justify-center">
              <div className="">
                <EmailSendingIcon />
              </div>
              <Title>Kiểm tra hòm thư điện tử của bạn</Title>
              <TextDescription className="mt-4 text-center">
                Vui lòng kiểm tra thư xác minh trong hòm thư đến.
                <br />
                vào đường dẫn trong email để xác nhận địa chỉ email của bạn.
              </TextDescription>
            </div>
            <div className="mt-7 bg-white rounded-md w-96 h-40">
              <TextDescription className="mt-9 text-center">
                Didn't receive the email?{" "}
                <div
                  className="flex flex-col items-center justify-center mt-10"
                  onClick={handleLogin}
                >
                  <ArrowLeftIcon
                    accessoriesRight={
                      <UnderlineText className="font-medium">
                        {" "}
                        Quay lại trang đăng nhập
                      </UnderlineText>
                    }
                  />
                </div>
              </TextDescription>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
