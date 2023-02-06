import React from "react"

function ArrowRightIcon({ color = "#201600", ...props }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.71 11.29a1.002 1.002 0 010 1.42l-8 8a1 1 0 01-1.639-.325 1 1 0 01.219-1.095l7.3-7.29-7.3-7.29a1.004 1.004 0 011.42-1.42l8 8z"
        fill={color}
      />
    </svg>
  )
}

export default ArrowRightIcon
