import React from "react"

function LogoutIcon(props) {
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
        d="M18 4.75h-4a.75.75 0 010-1.5h4A2.75 2.75 0 0120.75 6v12A2.75 2.75 0 0118 20.75h-4a.75.75 0 010-1.5h4c.69 0 1.25-.56 1.25-1.25V6c0-.69-.56-1.25-1.25-1.25zM7.53 7.47a.75.75 0 010 1.06l-2.72 2.72H15a.75.75 0 010 1.5H4.81l2.72 2.72a.75.75 0 11-1.06 1.06l-4-4a.75.75 0 010-1.06l4-4a.75.75 0 011.06 0z"
        fill="#999"
      />
    </svg>
  )
}

export default LogoutIcon
