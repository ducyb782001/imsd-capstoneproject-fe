import React from "react"

function VnFlagIcon(props) {
  return (
    <svg
      width={21}
      height={15}
      viewBox="0 0 21 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_3_12)">
        <mask
          id="a"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={21}
          height={15}
        >
          <path
            d="M19 0H2a2 2 0 00-2 2v11a2 2 0 002 2h17a2 2 0 002-2V2a2 2 0 00-2-2z"
            fill="#fff"
          />
        </mask>
        <g mask="url(#a)">
          <path
            d="M19 0H2a2 2 0 00-2 2v11a2 2 0 002 2h17a2 2 0 002-2V2a2 2 0 00-2-2z"
            fill="#DC220D"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.502 9.33l-2.09 1.1.4-2.327-1.69-1.647 2.336-.34L10.502 4l1.045 2.116 2.335.34-1.69 1.647.4 2.326"
            fill="#FF0"
          />
          <path
            d="M19 .5H2A1.5 1.5 0 00.5 2v11A1.5 1.5 0 002 14.5h17a1.5 1.5 0 001.5-1.5V2A1.5 1.5 0 0019 .5z"
            stroke="#000"
            strokeOpacity={0.1}
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_3_12">
          <path fill="#fff" d="M0 0H21V15H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default VnFlagIcon
