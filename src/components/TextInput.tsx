import React from "react"

function TextInput({ className = "", title = "", placeholder = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <p className="text-sm font-medium text-grayDark">{title}</p>
      <input
        placeholder={placeholder}
        {...props}
        className="outline-none py-[14px] px-4 rounded border-grayLight border-[1px] w-full focus:border-primary smooth-transform"
      />
    </div>
  )
}

export default TextInput