import React from "react"

function PlusIcon({ color = "#FFFFFF", ...props }) {
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
        d="M12 3.25a.75.75 0 01.75.75v7.25H20a.75.75 0 010 1.5h-7.25V20a.75.75 0 01-1.5 0v-7.25H4a.75.75 0 010-1.5h7.25V4a.75.75 0 01.75-.75z"
        fill={color}
      />
    </svg>
  )
}

export default PlusIcon
