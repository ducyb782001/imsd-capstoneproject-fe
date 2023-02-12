import React from "react"

function ReadOnlyField({
  className = "",
  title = "",
  placeholder = "",
  type = "text",
  ...props
}) {
  return (
    <div className={`${className}`}>
      <p className="text-sm font-bold text-black">{title}</p>
      <div className={`w-full ${title ? "mt-1" : ""}`}>
        <input
          placeholder={placeholder}
          {...props}
          type={type}
          // onChange={onChange}
          // value={value}
          readOnly={true}
          className={`w-full px-4 py-3 mt-1 border rounded outline-none bg-[#F8F9FB] text-black border-[#DFE3E8] focus:border-[#DFE3E8] smooth-transform
        }`}
        />
      </div>
    </div>
  )
}

export default ReadOnlyField
