import React from "react"

function ApproveIcon(props) {
  return (
    <svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={40} cy={40} r={30} stroke="#35B75E" strokeWidth={4} />
      <path d="M26.667 40l10 10 16.666-20" stroke="#35B75E" strokeWidth={4} />
    </svg>
  )
}

export default ApproveIcon
