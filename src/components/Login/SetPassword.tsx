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

function SetPassword(props) {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userPassword2, setUserPassword2] = useState("")
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()

  const handleLogin = (event) => {
    router.push("/login")
  }
  const handleChangePass = (event) => {
    var passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    if (userPassword !== userPassword2) {
      toast.error("Confirm password failed! Please check again!")
    }
    if (!passRegex.test(userPassword)) {
      toast.error(
        "Password must contain at least 8 character, one uppercase letter, one number!",
      )
    }
    if (userPassword == userPassword2 && passRegex.test(userPassword)) {
      resetPassMutation.mutate()
    }
  }


  const resetPassMutation = useMutation(
    () => {
      var paramLink = router.query["token"].toString();
      var link = resetPassword+ encodeURIComponent(paramLink) +"&newpwd="+userPassword;
      return axios.post(
        link,
      )
    },
    {
      onSuccess: (data, error, variables) => {
        toast.success("Reset password successful!")
        setDisabled(true)
        setTimeout(() => {
          router.push("/login")
        }, 300)
      },
      onError: (data: any) => {
        console.log("login error", data)
        toast.error("Reset link is expired!")
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
                <KeyIcon />
              </div>
              <Title>Set new password</Title>
              <TextDescription className="mt-4">
                Your new password must be different to previously used
                passwords.
              </TextDescription>
            </div>
            <div className="mt-7 bg-white rounded-md w-4/5 h-3/5">
              <div className="flex flex-col ml-16 w-4/5 gap-6 mt-16 ">
                <PasswordInput
                  onChange={(event) => setUserPassword(event.target.value)}
                />
                <PasswordInput
                  title="Confirm Password"
                  onChange={(event) => setUserPassword2(event.target.value)}
                  placeholder="Confirm your password"
                />
                <PrimaryBtn onClick={handleChangePass} className="mt-1">
                  Reset password
                </PrimaryBtn>
                <div
                  className="flex flex-col items-center justify-center"
                  onClick={handleLogin}
                >
                  <ArrowLeftIcon
                    accessoriesRight={
                      <UnderlineText className="font-medium">
                        {" "}
                        Back to login
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
