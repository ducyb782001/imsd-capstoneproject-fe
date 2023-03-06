import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import UnderlineText from "../UnderlineText"
import ArrowLeftIcon from "../icons/ArrowLeftIcon"
import Title from "../Title"
import CheckedIcon from "../icons/CheckedIcon"
import LeftBlockBackground from "./LeftBlockBackground"
import { LeftBlock } from "./Login"

function ResetSuccessful(props) {
  const router = useRouter()

  const handleContinue = (event) => {}
  const handleLogin = (event) => {
    router.push("/login")
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
                <CheckedIcon />
              </div>
              <Title>Password reset</Title>
              <TextDescription className="mt-4">
                Your password has been successfully reset. Click below to login
                magically.
              </TextDescription>
            </div>
            <div className="mt-7 bg-white rounded-md w-8/12 h-1/4 flex flex-col items-center justify-center">
              <PrimaryBtn onClick={handleContinue} className="w-4/6 ">
                Continue
              </PrimaryBtn>
              <div className="mt-8" onClick={handleLogin}>
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
  )
}

export default ResetSuccessful
