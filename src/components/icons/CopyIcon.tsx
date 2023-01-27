import React from "react"

function CopyIcon({ color = "#4F4F4F", ...props }) {
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
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        d="M9 8H19V20H9z"
      />
      <path
        d="M5 16V4h11"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default CopyIcon
