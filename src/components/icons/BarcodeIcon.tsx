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
        d="M10 4a1 1 0 01-1 1H6a1 1 0 00-1 1v3a1 1 0 01-2 0V6a3 3 0 013-3h3a1 1 0 011 1zM9 19H6a1 1 0 01-1-1v-3a1 1 0 10-2 0v3a3 3 0 003 3h3a1 1 0 000-2zm11-5a1 1 0 00-1 1v3a1 1 0 01-1 1h-3a1 1 0 000 2h3a3 3 0 003-3v-3a1 1 0 00-1-1zm-5-9h3a1 1 0 011 1v3a1 1 0 002 0V6a3 3 0 00-3-3h-3a1 1 0 100 2z"
        fill="#222221"
      />
    </svg>
  )
}

export default BarcodeIcon
