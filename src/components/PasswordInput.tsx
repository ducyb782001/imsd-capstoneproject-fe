import React, { useState } from "react"
import HidePasswordIcon from "./icons/HidePasswordIcon"
import ShowPasswordIcon from "./icons/ShowPasswordIcon"

function PasswordInput({
  className = "",
  title = "Password",
  placeholder = "Enter your password",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <p className="text-sm font-medium">{title}</p>
      <div className="relative w-full">
        <input
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...props}
          className="outline-none py-[14px] px-4 rounded border-grayLight border-[1px] w-full focus:border-primary smooth-transform"
        />
        <div
          className="absolute top-[14px] cursor-pointer my-auto right-4"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
        </div>
      </div>
    </div>
  )
}

export default PasswordInput
