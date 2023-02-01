import * as React from "react"

function ArrowLeftIcon({
  className = "",
  accessoriesRight = null,
  
}) {

  return (
    <label className={`flex items-center ${className}`}>
    <div className="w-4 h-5 cursor-pointer" >
      <svg
      width={17}
      height={16}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 8a1 1 0 01-1 1H4.41l4.3 4.29a1.004 1.004 0 01-1.42 1.42l-6-6a1 1 0 010-1.42l6-6a1.004 1.004 0 111.42 1.42L4.41 7H16a1 1 0 011 1z"
        fill="#222221"
      />
    </svg>
    </div>
    {accessoriesRight && (
        <div className="ml-3 cursor-pointer text-center mb-1.5">{accessoriesRight}</div>
      )}
    </label>
  )
}

export default ArrowLeftIcon