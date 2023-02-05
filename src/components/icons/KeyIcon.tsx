import * as React from "react"

function KeyIcon(props) {
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
        d="M39.537 40.463L53.5 26.5M49 31l3 3-4.5 4.5-3-3m-3 9.75A6.752 6.752 0 0134.748 52 6.752 6.752 0 0128 45.25a6.752 6.752 0 016.748-6.75 6.752 6.752 0 016.752 6.75z"
        stroke="#6A44D2"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default KeyIcon
