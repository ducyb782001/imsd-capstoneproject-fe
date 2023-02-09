import React, { useState } from "react"
import HidePasswordIcon from "./icons/HidePasswordIcon"
import ShowPasswordIcon from "./icons/ShowPasswordIcon"

function PasswordInput({
  className = "",
  title = null,
  placeholder = "Nhập mật khẩu vào đây",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h5 className="mb-2 text-sm text-black font-bold">{title}</h5>
      <div className="relative w-full">
        <input
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...props}
          className="outline-none py-[14px] px-4 rounded bg-transparent border-gray border-[1px] w-full focus:border-primary smooth-transform"
        />
        <div
          className="absolute top-[19px] cursor-pointer my-auto right-4"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
        </div>
      </div>
    </div>
  )
}

export default PasswordInput
