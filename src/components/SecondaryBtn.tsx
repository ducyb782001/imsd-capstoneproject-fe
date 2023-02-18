import React from "react"

function SecondaryBtn({
  className = "",
  accessoriesLeft = null,
  accessoriesRight = null,
  children,
  onClick = null,
  ...props
}) {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`w-full rounded-md text-primary hover:text-white border border-primary text-base font-medium py-3 px-4 hover:bg-primary active:bg-primaryDark active:border-primaryDark disabled:opacity-50 disabled:cursor-not-allowed smooth-transform flex justify-center items-center gap-3 change-color-svg ${className}`}
    >
      {accessoriesLeft && <div className="">{accessoriesLeft}</div>}
      {children}
      {accessoriesRight && <div className="">{accessoriesRight}</div>}
    </button>
  )
}
export default SecondaryBtn
