import React from "react"

function PersonalIcon(props) {
  return (
    <svg
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1056_33525)">
        <path
          d="M13 13a4.332 4.332 0 004.333-4.333A4.332 4.332 0 0013 4.334a4.332 4.332 0 00-4.334 4.333A4.332 4.332 0 0013 13zm0 2.167c-2.893 0-8.667 1.452-8.667 4.333v2.167h17.333V19.5c0-2.881-5.774-4.333-8.666-4.333z"
          fill="#000"
          fillOpacity={0.54}
        />
      </g>
      <defs>
        <clipPath id="clip0_1056_33525">
          <path fill="#fff" d="M0 0H26V26H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default PersonalIcon
