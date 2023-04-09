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
import EmailSendingIcon from "../icons/EmailSendingIcon"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function InputEmailForgot() {
  const [userEmail, setUserEmail] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [mailLocalStorage, setMailLocalStorage] = useState("")
  const [time, setTime] = useState(60)

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
        toast.success("Gửi email cài lại mật khẩu thành công!")
        setDisabled(true)
        setTime(60)
        setMailLocalStorage(userEmail)
      },
      onError: (data: any) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        setTime(60)
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

  useEffect(() => {
    if (time === 0) {
      return
    }

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [time])

  const sendButtonText = time === 0 ? "Gửi" : time

  return (
    <div className="relative">
      <div className="absolute z-[2]">
        <LeftBlockBackground />
      </div>

      <div className="absolute grid items-center w-screen h-screen grid-cols-46 z-[5]">
        <LeftBlock />
        {mailLocalStorage ? (
          <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-[#F6F5FA]">
            <div className="flex flex-col items-center justify-center w-full h-full px-4 ">
              <div className="min-w-[440px] mt-6 flex flex-col items-center justify-center">
                <div className="">
                  <EmailSendingIcon />
                </div>
                <Title>Kiểm tra hòm thư điện tử của bạn</Title>
                <TextDescription className="mt-4 text-center">
                  Chúng tôi đã gửi tin nhắn cài lại mật khẩu đến hòm thư của
                  bạn.
                </TextDescription>
              </div>
              <div className="py-6 bg-white rounded-md mt-7 w-96">
                <TextDescription className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-base">
                      Không nhận được thư nào? Gửi lại mail xác nhận
                    </p>
                    <PrimaryBtn
                      className="!py-1 max-w-[100px]"
                      disabled={time > 0}
                      onClick={handleSendEmail}
                    >
                      {sendButtonText}
                    </PrimaryBtn>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center mt-8"
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
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-[#F6F5FA]">
            <div className="flex flex-col items-center justify-center w-full h-full px-4 ">
              <div className="min-w-[440px] mt-6 flex flex-col items-center justify-center text-center">
                <div className="">
                  <KeyIcon />
                </div>
                <Title>Quên mật khẩu?</Title>
                <TextDescription className="mt-4">
                  Nhập tài khoản hòm thư đã liên kết với tài khoản của bạn!{" "}
                  <br /> <span>(Đối với chủ kho)</span>
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
        )}
      </div>
    </div>
  )
}

export default InputEmailForgot
