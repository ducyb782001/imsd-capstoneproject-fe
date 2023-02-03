import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import TextDescription from "../TextDescription"
import UnderlineText from "../UnderlineText"
import PrimaryInput from "../PrimaryInput"
import Title from "../Title"
import EmailSendingIcon from "../icons/EmailSendingIcon"
import ArrowLeftIcon from "../icons/ArrowLeftIcon"
import LeftBlockBackground from "./LeftBlockBackground"
import { LeftBlock } from "./Login"
import KeyIcon from "../icons/KeyIcon"

function SetPassword(props) {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()


  const handleLogin = (event) => {
  router.push("/login")
    
  }
  const handleForgot = (event) => {
    router.push("/login")
  }
const handleSignUp = (event) => {
  router.push("/signup")
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
             <KeyIcon/>
             </div>
             <Title>Set new password</Title>
            <TextDescription className="mt-4">
               Your new password must be different to previously used passwords.
             </TextDescription>
           </div>
           <div className="mt-7 bg-white rounded-md w-4/5 h-3/5" >
           <div className="flex flex-col ml-16 w-4/5 gap-6 mt-16 ">
           <PasswordInput />
              <PasswordInput
                title="Confirm Password"
                placeholder="Confirm your password"
              />
                <PrimaryBtn className="mt-1">Reset password</PrimaryBtn>
                <div className="flex flex-col items-center justify-center" onClick={handleLogin}>
                <ArrowLeftIcon accessoriesRight={<UnderlineText className="font-medium" > Back to login</UnderlineText>}/>
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