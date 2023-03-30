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
import { confirmEmailUrl } from "../../constants/APIConfig"
import { toast } from "react-toastify"
import { verifyAccount } from "../../apis/user-module"

function VerifySuccessful() {
  // const [param, setParam] = useState("")

  // const router = useRouter()

  // const handleLogin = (event) => {
  //   router.push("/login")
  // }
  // const { token } = router.query

  // useEffect(() => {
  //   var parameter = token + ""
  //   setParam(confirmEmailUrl + parameter)
  // })

  // useEffect(() => {
  //   if (param != undefined) {
  //     resetPassMutation.mutate()
  //   }
  // }, [param])

  // const resetPassMutation = useMutation(() => {
  //   return axios.post(param)
  // })
  const router = useRouter()
  const { token } = router.query

  useEffect(() => {
    if (token) {
      verifyToken.mutate(token)
    }
  }, [token])

  const verifyToken = useMutation(
    async (token: any) => {
      return await verifyAccount({ token: token })
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          console.log("Verify Success")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Something went wrong",
            )
          }
        }
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
        <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-[#F6F5FA]">
          <div className="flex flex-col items-center justify-center w-full h-full px-4 ">
            <div className="min-w-[440px] mt-6 flex flex-col items-center justify-center">
              <div className="">
                <CheckedIcon />
              </div>
              <Title>Xác minh thành công!</Title>
              <TextDescription className="mt-4">
                Bạn đã xác minh tài khoản thành công. Xin mời đăng nhập.
              </TextDescription>
            </div>
            <div className="flex flex-col items-center justify-center w-8/12 h-40 bg-white rounded-md mt-7">
              <PrimaryBtn
                onClick={() => router.push("/login")}
                disabled={false}
                className="w-4/6 "
              >
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
