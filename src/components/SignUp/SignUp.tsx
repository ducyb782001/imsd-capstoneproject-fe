import React from "react"
import { useRouter } from "next/router"
import LeftBlockBackground from "../Login/LeftBlockBackground"
import { LeftBlock } from "../Login/Login"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import TextInput from "../TextInput"
import Title from "../Title"
import UnderlineText from "../UnderlineText"




function Signup(props) {
  const router = useRouter()

  const handleSignUp = (event) => {
    router.push("/login")
    }
  return (
    <div className="relative">
      <div className="absolute z-[2]">
        <LeftBlockBackground />
      </div>

      <div className="absolute grid items-center w-screen h-screen grid-cols-46 z-[5]">
        <LeftBlock />
        <div className="flex flex-col items-center justify-center w-full h-full px-4 bg-white">
          <div className="min-w-[440px]">
            <Title>Sign up</Title>
            <TextDescription className="mt-4">
              Create an account to get started.
            </TextDescription>
            <div className="flex flex-col w-full gap-6 mt-11">
              <TextInput placeholder="Enter your email" title="Email" />
              <PasswordInput />
              <PasswordInput
                title="Confirm Password"
                placeholder="Confirm your password"
              />
            </div>
            <PrimaryBtn className="mt-11">Sign up</PrimaryBtn>
            <TextDescription className="mt-6 text-center">
              Already have an account?{" "}
              <UnderlineText className="font-medium" onClick={handleSignUp}>Log in</UnderlineText>
            </TextDescription>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
