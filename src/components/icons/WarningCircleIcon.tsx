import React from "react"

function WarningCircleIcon(props) {
  return (
    <svg
      width={81}
      height={80}
      viewBox="0 0 81 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M40.5 70c16.569 0 30-13.431 30-30 0-16.569-13.431-30-30-30-16.569 0-30 13.431-30 30 0 16.569 13.431 30 30 30z"
        stroke="#DC2323"
        strokeWidth={4}
        strokeMiterlimit={10}
      />
      <path
        d="M40.5 25v17.5"
        stroke="#DC2323"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.5 56.667a3.333 3.333 0 100-6.667 3.333 3.333 0 000 6.667z"
        fill="#DC2323"
      />
    </svg>
  )
}

export default WarningCircleIcon
