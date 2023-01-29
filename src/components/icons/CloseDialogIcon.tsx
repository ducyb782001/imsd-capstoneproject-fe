import React from "react"

function CloseDialogIcon({ color = "#7F7F7F", ...props }) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.189 19.05c-.37.37-.387 1.03.008 1.416.387.386 1.046.378 1.415.009l5.38-5.388 5.387 5.388a1.016 1.016 0 001.415-.01c.378-.395.387-1.036 0-1.414l-5.379-5.388 5.38-5.379a1.008 1.008 0 000-1.415c-.396-.378-1.038-.387-1.416-.009l-5.388 5.388L8.612 6.86c-.369-.369-1.037-.386-1.415.01-.386.386-.378 1.045-.008 1.414l5.387 5.38L7.19 19.05z"
        fill={color}
      />
    </svg>
  )
}

export default CloseDialogIcon
