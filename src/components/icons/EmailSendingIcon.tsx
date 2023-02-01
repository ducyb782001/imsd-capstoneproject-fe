import * as React from "react"
import { isBlock } from "typescript"

function emailSendingIcon(props) {
  return (
    <svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={80} height={80} rx={40} fill="#EFEAFA" />
      <rect
        x={12}
        y={12}
        width={56}
        height={56}
        rx={28}
        fill="#CEC1F0"
        fillOpacity={0.25}
      />
      <path
        d="M27.25 30.25l10.629 10.629a3 3 0 004.242 0L52.75 30.25M28 50.5h24a1.5 1.5 0 001.5-1.5V31a1.5 1.5 0 00-1.5-1.5H28a1.5 1.5 0 00-1.5 1.5v18a1.5 1.5 0 001.5 1.5z"
        stroke="#6A44D2"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default emailSendingIcon
