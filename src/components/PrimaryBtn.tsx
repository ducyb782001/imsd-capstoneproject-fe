import React from "react"

function PrimaryBtn({
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
      className={`bg-primary w-full rounded-md text-white border border-primary font-medium py-3 px-4 active:bg-primaryDark active:border-pribg-primaryDark disabled:opacity-40 disabled:cursor-not-allowed smooth-transform flex justify-center items-center gap-3 text-base ${className}`}
    >
      {accessoriesLeft && <div className="">{accessoriesLeft}</div>}
      {children}
      {accessoriesRight && <div className="">{accessoriesRight}</div>}
    </button>
  )
}

export default PrimaryBtn
