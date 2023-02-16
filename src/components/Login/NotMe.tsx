import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import Title from "../Title"
import CheckedIcon from "../icons/CheckedIcon"
import LeftBlockBackground from "./LeftBlockBackground"
import { LeftBlock } from "./Login"
import { useMutation } from "react-query"
import axios from "axios"
import { notMeUrl } from "../../constants/APIConfig"
import { toast } from "react-toastify"

function VerifySuccessful(props) {
  const router = useRouter()

  const handleLogin = (event) => {
    router.push("/login")
  }

  useEffect(() => {
    resetPassMutation.mutate()
  }, [])
  const resetPassMutation = useMutation(() => {
    var paramLink = router.query["token"] + ""
    var link = notMeUrl + paramLink
    return axios.post(link)
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
                <CheckedIcon />
              </div>
              <Title>Hủy thay đổi mật khẩu thành công!</Title>
              <TextDescription className="mt-4">
                Bạn đã hủy mã thay đổi mật khẩu thành công. Xin mời đăng nhập.
              </TextDescription>
            </div>
            <div className="mt-7 bg-white rounded-md w-8/12 h-40 flex flex-col items-center justify-center">
              <PrimaryBtn onClick={handleLogin} className="w-4/6 ">
                Đăng nhập
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifySuccessful
