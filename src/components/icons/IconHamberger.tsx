import * as React from "react"

function IconHamberger({ color = "#6A44D2", ...props }) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 7A.75.75 0 014 6.25h16a.75.75 0 010 1.5H4A.75.75 0 013.25 7zm0 5a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75z"
        fill={color}
      />
    </svg>
  )
}

export default IconHamberger
