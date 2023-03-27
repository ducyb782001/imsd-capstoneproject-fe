import React from "react"

function BarcodeIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 10V9c0-.93 0-1.395-.102-1.776a3 3 0 00-2.122-2.122C17.395 5 16.93 5 16 5M20 14v1c0 .93 0 1.395-.102 1.776a3 3 0 01-2.122 2.122C17.395 19 16.93 19 16 19M10 19H9c-1.87 0-2.804 0-3.5-.402A3 3 0 014.402 17.5C4 16.804 4 15.87 4 14M10 5H9c-1.87 0-2.804 0-3.5.402A3 3 0 004.402 6.5C4 7.196 4 8.13 4 10"
        stroke="#33363F"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M10 21V3"
        stroke="#33363F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BarcodeIcon
