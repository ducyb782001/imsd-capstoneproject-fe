import * as React from "react"

function CheckedIcon(props) {
  return (
    <svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={80} height={80} rx={40} fill="#E6F8EC" />
      <rect
        x={12}
        y={12}
        width={56}
        height={56}
        rx={28}
        fill="#B3EBC5"
        fillOpacity={0.4}
      />
      <path
        d="M52 32.5L35.5 49 28 41.5"
        stroke="#35B75E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckedIcon
