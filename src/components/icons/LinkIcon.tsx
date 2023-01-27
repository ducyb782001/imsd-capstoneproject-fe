import React from "react"

function LinkIcon({ color = "#4F4F4F", ...props }) {
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
        d="M20 4L10 14M20 4v6m0-6h-6m-4 0H4v16h16v-6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LinkIcon
