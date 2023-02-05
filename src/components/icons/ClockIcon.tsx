import React from "react"

function ClockIcon({ color = "#7F7F7F", ...props }) {
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
        d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 6.25a.75.75 0 01.75.75v4.69l2.78 2.78a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 01-.22-.53V7a.75.75 0 01.75-.75z"
        fill={color}
      />
    </svg>
  )
}

export default ClockIcon
