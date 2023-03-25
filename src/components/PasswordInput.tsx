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
    <div className={`flex flex-col ${className}`}>
      <div className="mb-2 text-sm font-bold text-gray">{title}</div>
      <div className="relative w-full">
        <input
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...props}
          className="outline-none h-[46px] py-3 px-4 rounded bg-transparent border-gray border-[1px] w-full focus:border-primary smooth-transform"
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
