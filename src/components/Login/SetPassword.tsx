import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import UnderlineText from "../UnderlineText"
import Title from "../Title"
import ArrowLeftIcon from "../icons/ArrowLeftIcon"
import LeftBlockBackground from "./LeftBlockBackground"
import { LeftBlock } from "./Login"
import KeyIcon from "../icons/KeyIcon"
import { toast } from "react-toastify"
import { useMutation } from "react-query"
import { resetPassword } from "../../constants/APIConfig"
import { passRegex } from "../../constants/constants"
import Tooltip from "../ToolTip"
import InfoIcon from "../icons/InfoIcon"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function SetPassword(props) {
  const [userPassword, setUserPassword] = useState("")
  const [userPassword2, setUserPassword2] = useState("")
  const [disabled, setDisabled] = useState(true)

  const router = useRouter()

  const handleLogin = (event) => {
    router.push("/login")
  }
  const handleChangePass = (event) => {
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    resetPassMutation.mutate()
  }
  const { token } = router.query

  const resetPassMutation = useMutation(
    () => {
      var paramLink = token
      var link = resetPassword + paramLink + "&newpwd=" + userPassword
      return axios.post(link)
    },
    {
      onSuccess: (data, error, variables) => {
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.success("Cài lại mật khẩu thành công!")
        setDisabled(false)
        setTimeout(() => {
          router.push("/login")
        }, 300)
      },
      onError: (data: any) => {
        console.log("login error", data)
        // toast.error("Link reset mật khẩu lỗi! Xin thực hiện lại!")
        toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
        toast.error("Cài lại mật khẩu thất bại, xin kiểm tra lại!")
      },
    },
  )

  useEffect(() => {
    if (userPassword == userPassword2) {
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
              <Title>Đặt lại mật khẩu</Title>
              <TextDescription className="mt-4">
                Mật khẩu của bạn phải khác với những mật khẩu đã dùng trước đây.
              </TextDescription>
            </div>
            <div className="w-7/12 bg-white rounded-md mt-7 h-3/6">
              <div className="flex flex-col w-4/5 gap-6 mt-16 ml-16 ">
                <PasswordInput
                  title={
                    <div className="flex gap-1">
                      <h1>Mật khẩu</h1>
                      <Tooltip
                        content={
                          <div>
                            Mật khẩu phải chứa ít nhất 8 và không quá 32 kí tự
                            <h1>
                              Phải bao gồm chữ in hoa, in thường, số, không được
                              để trống
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
                <PasswordInput
                  title={
                    <div className="flex gap-1">
                      <h1>Nhập lại mật khẩu</h1>
                      <Tooltip
                        content={
                          <div>
                            Mật khẩu phải chứa ít nhất 8 và không quá 32 kí tự
                            <h1>
                              Phải bao gồm chữ in hoa, in thường, số, không được
                              để trống
                            </h1>
                          </div>
                        }
                      >
                        <InfoIcon />
                      </Tooltip>
                    </div>
                  }
                  onChange={(event) => setUserPassword2(event.target.value)}
                  placeholder="Xác nhận lại mật khẩu"
                />
                <PrimaryBtn
                  onClick={handleChangePass}
                  disabled={disabled}
                  className="mt-1"
                >
                  Cài lại mật khẩu
                </PrimaryBtn>
                <div
                  className="flex flex-col items-center justify-center"
                  onClick={handleLogin}
                >
                  <ArrowLeftIcon
                    accessoriesRight={
                      <UnderlineText className="font-medium">
                        {" "}
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

export default SetPassword
