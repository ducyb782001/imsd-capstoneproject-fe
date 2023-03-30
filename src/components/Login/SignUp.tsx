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
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function Signup() {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userPassword2, setUserPassword2] = useState("")

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
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.success("Đăng kí thành công!")
        setTimeout(() => {
          router.push("/confirm-email")
        }, 300)
      },
      onError: (data: any) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.error("Something when wrong")
      },
    },
  )

  const canChangePassword = checkPassword(userPassword)
  const confirmChange = checkSamePassword(userPassword, userPassword2)

  return (
    <div className="relative">
      <div className="absolute z-[2]">
        <LeftBlockBackground />
      </div>

      <div className="absolute grid items-center w-screen h-screen grid-cols-46 z-[5]">
        <LeftBlock />
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
                  * Password must be at least 8 characters with at least 1 Upper
                  Case, 1 lower case, 1 special character and 1 numeric
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
      </div>
    </div>
  )
}

export default Signup
