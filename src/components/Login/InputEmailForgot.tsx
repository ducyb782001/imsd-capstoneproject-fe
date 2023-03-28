import React, { useEffect, useState } from "react"
import axios from "axios"
import { useMutation } from "react-query"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import UnderlineText from "../UnderlineText"
import PrimaryInput from "../PrimaryInput"
import Title from "../Title"
import ArrowLeftIcon from "../icons/ArrowLeftIcon"
import LeftBlockBackground from "./LeftBlockBackground"
import { sendEmailUrl } from "../../constants/APIConfig"
import { toast } from "react-toastify"
import { LeftBlock } from "./Login"
import KeyIcon from "../icons/KeyIcon"
import { emailRegex } from "../../constants/constants"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function InputEmailForgot() {
  const [userEmail, setUserEmail] = useState("")
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()

  const handleLogin = (event) => {
    router.push("/login")
  }

  const loginMutation = useMutation(
    (login) => {
      return axios.post(sendEmailUrl + userEmail)
    },
    {
      onSuccess: (data, error, variables) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.success("Nhập tài khoản thành công!")
        setDisabled(true)
        setTimeout(() => {
          router.push("/check-reset-password-alert")
        }, 300)
      },
      onError: (data: any) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.error("Địa chỉ email không tồn tại")
      },
    },
  )

  const handleSendEmail = (event) => {
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    event.preventDefault()
    // @ts-ignore
    loginMutation.mutate({
      email: userEmail,
    })
  }

  useEffect(() => {
    if (emailRegex.test(userEmail)) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  })

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
                <KeyIcon />
              </div>
              <Title>Quên mật khẩu?</Title>
              <TextDescription className="mt-4">
                Nhập tài khoản hòm thư đã liên kết với tài khoản của bạn!
              </TextDescription>
            </div>
            <div className="w-7/12 bg-white rounded-md mt-7 h-2/5">
              <div className="flex flex-col w-4/5 gap-6 mt-12 ml-16 ">
                <PrimaryInput
                  title="Email"
                  placeholder="Nhập email của bạn"
                  onChange={(event) => setUserEmail(event.target.value)}
                />
                <PrimaryBtn
                  className="mt-3"
                  disabled={disabled}
                  onClick={handleSendEmail}
                >
                  Gửi
                </PrimaryBtn>
                <div
                  className="flex flex-col items-center justify-center"
                  onClick={handleLogin}
                >
                  <ArrowLeftIcon
                    // className="mt-4"
                    accessoriesRight={
                      <UnderlineText className="font-medium">
                        Quay lại đăng nhập
                      </UnderlineText>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputEmailForgot
