import React from "react"

function ShowDetailIcon(props) {
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
        d="M22 12s-3.636-7-10-7-10 7-10 7 3.636 7 10 7 10-7 10-7z"
        stroke="#343434"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 110-6 3 3 0 010 6z"
        stroke="#343434"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ShowDetailIcon
