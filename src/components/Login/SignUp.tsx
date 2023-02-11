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
import { passRegex } from "../../constants/constants"
import { emailRegex } from "../../constants/constants"

function Signup(props) {

  const [disabled, setDisabled] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userPassword2, setUserPassword2] = useState("")

  const router = useRouter()
  const handleLogin = (event) => {
    router.push("/login")
  }

  const handleSignUp = (event) => {
    event.preventDefault()
    if(userPassword==userPassword2 && passRegex.test(userPassword) && emailRegex.test(userEmail)){
    // @ts-ignore
    signUpMutation.mutate({
        email: userEmail,
        password: userPassword,
      })
    }
  }
const signUpMutation = useMutation(
    (account) => {
      return axios.post(signUpUrl,account)
    },
    {
      onSuccess: (data, error, variables) => {
        toast.success("Đăng kí thành công!")
        setTimeout(() => {
          router.push("/confirm-email")
        }, 300)
      },
      onError: (data: any) => {
        console.log("login error", data)
        toast.success("Đăng kí thành công!")
        router.push("/confirm-email")

        // toast.error("Có lỗi xảy ra! Xin hãy đăng nhập lại!")
      },
    },
  )

  useEffect(() => {
    if (userPassword==userPassword2 && passRegex.test(userPassword) && emailRegex.test(userEmail)) {
      setDisabled(false);
    }else{
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
        <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-white">
          <div className="min-w-[440px]">
            <Title>Đăng kí</Title>
            <TextDescription className="mt-4">
              Tạo một tài khoản mới để bắt đầu.
            </TextDescription>
            <div className="flex flex-col w-full gap-6 mt-11">
              <PrimaryInput onChange={(event) => setUserEmail(event.target.value)}  placeholder="Nhập email của bạn" title="Email" />
              <PasswordInput title="Mật khẩu" onChange={(event) => setUserPassword2(event.target.value)}/>
              <PasswordInput
                onChange={(event) => setUserPassword(event.target.value)}
                title="Xác nhận mật khẩu"
                placeholder="Xác nhận mật khẩu của bạn"
              />
            </div>
            <PrimaryBtn
                  disabled={disabled}
            className="mt-11" onClick={handleSignUp}>Đăng kí</PrimaryBtn>
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
