import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import LeftBlockBackground from "../Login/LeftBlockBackground"
import { LeftBlock } from "../Login/Login"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import Title from "../Title"
import UnderlineText from "../UnderlineText"
import PrimaryInput from "../PrimaryInput"
import { toast } from "react-toastify"
import axios from "axios"
import { useMutation } from "react-query"
import { signUpUrl } from "../../constants/APIConfig"
import InfoIcon from "../icons/InfoIcon"
import Tooltip from "../ToolTip"
import { isValidGmail } from "../../hooks/useValidator"
import { checkPassword, checkSamePassword } from "../../lib/check-password"
import { signUpUser } from "../../apis/user-module"
import EmailSendingIcon from "../icons/EmailSendingIcon"
import ArrowLeftIcon from "../icons/ArrowLeftIcon"
import { resendEmail } from "../../apis/auth"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"
const TOAST_RESEND_EMAIL = "toast-resend-email"

function Signup() {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userPassword2, setUserPassword2] = useState("")
  const [mailLocalStorage, setMailLocalStorage] = useState("")
  const [time, setTime] = useState(60)

  const router = useRouter()
  const handleLogin = (event) => {
    router.push("/login")
  }

  const handleSignUp = (event) => {
    event.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })

    // @ts-ignore
    signUpMutation.mutate({
      email: userEmail,
      password: userPassword,
    })
  }

  const signUpMutation = useMutation(
    async (newUser) => {
      return await signUpUser(newUser)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Đăng kí thành công!")
          setMailLocalStorage(userEmail)
          setTime(60)
        } else {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.error(data?.response?.data)
        }
      },
      onError: (data: any) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.error("Something when wrong")
      },
    },
  )

  const canChangePassword = checkPassword(userPassword)
  const confirmChange = checkSamePassword(userPassword, userPassword2)

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

  const handleResendEmail = (event) => {
    event.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_RESEND_EMAIL,
    })

    // @ts-ignore
    resendEmailMutation.mutate({
      email: userEmail,
    })
  }

  const resendEmailMutation = useMutation(
    async (email) => {
      return await resendEmail(email)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_RESEND_EMAIL)
          toast.success("Gửi lại thư xác nhận thành công!")
          setTime(60)
        } else {
          toast.dismiss(TOAST_RESEND_EMAIL)
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
          setTime(60)
        }
      },
      onError: (data: any) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.error("Something when wrong")
      },
    },
  )

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
                  Vui lòng kiểm tra thư xác minh trong hòm thư đến và nhấn
                  <br />
                  vào đường dẫn trong email để xác nhận địa chỉ email của bạn.
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
                      onClick={handleResendEmail}
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
          <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-white">
            <div className="w-[440px]">
              <Title>Đăng kí</Title>
              <TextDescription className="mt-4">
                Tạo một tài khoản mới để bắt đầu.
              </TextDescription>
              <div className="flex flex-col w-full mt-11">
                <PrimaryInput
                  onChange={(event) => setUserEmail(event.target.value)}
                  placeholder="Nhập email của bạn"
                  title="Email"
                />
                {userEmail && !!!isValidGmail(userEmail) && (
                  <p className="text-red-500">* Sai định dạng</p>
                )}
                <PasswordInput
                  className="mt-6"
                  title={
                    <div className="flex gap-1">
                      <h1>Mật khẩu</h1>
                      <Tooltip
                        content={
                          <div>
                            Mật khẩu phải chứa ít nhất 8 và không quá 32 kí tự
                            <h1>
                              Phải bao gồm chữ in hoa, in thường, số, kí tự đặc
                              biệt
                            </h1>
                          </div>
                        }
                      >
                        <InfoIcon />
                      </Tooltip>
                    </div>
                  }
                  onChange={(event) => setUserPassword(event.target.value)}
                />
                {!canChangePassword && userPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    * Password must be at least 8 characters with at least 1
                    Upper Case, 1 lower case, 1 special character and 1 numeric
                    character
                  </p>
                )}
                <PasswordInput
                  className="mt-6"
                  title={<h1>Xác nhận mật khẩu</h1>}
                  onChange={(event) => setUserPassword2(event.target.value)}
                  placeholder="Xác nhận mật khẩu của bạn"
                />
                {!confirmChange && userPassword2 && (
                  <p className="mt-1 text-sm text-red-500">
                    Mật khẩu phải trùng nhau
                  </p>
                )}
              </div>
              <PrimaryBtn
                className="mt-11"
                onClick={handleSignUp}
                disabled={
                  !confirmChange ||
                  !canChangePassword ||
                  (userEmail && !!!isValidGmail(userEmail))
                }
              >
                Đăng kí
              </PrimaryBtn>
              <TextDescription className="mt-6 text-center">
                Đã có tài khoản?{" "}
                <UnderlineText className="font-medium" onClick={handleLogin}>
                  Đăng nhập
                </UnderlineText>
              </TextDescription>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Signup
