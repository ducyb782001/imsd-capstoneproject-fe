import React from "react"

function SecondaryBtn({
  className = "",
  accessoriesLeft = null,
  accessoriesRight = null,
  children,
  ...props
}) {
  return (
    <button
      {...props}
      className={`w-full rounded-md text-primary border border-primary text-base font-medium py-3 px-4 hover:bg-[#6A44D230] active:bg-["#6A44D230"] active:border-primaryDark disabled:opacity-50 disabled:cursor-not-allowed smooth-transform flex justify-center items-center gap-3 change-color-svg ${className}`}
    >
      {accessoriesLeft && <div className="">{accessoriesLeft}</div>}
      {children}
      {accessoriesRight && <div className="">{accessoriesRight}</div>}
    </button>
  )
}
export default SecondaryBtn
