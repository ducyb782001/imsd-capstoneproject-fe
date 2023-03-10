import React from "react"

function EngFlagIcon(props) {
  return (
    <svg
      width={21}
      height={15}
      viewBox="0 0 21 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_908_30634)">
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
            fill="#22438B"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 1l-2.026.026L1 3l16.982 11.028 2.037-.037-.038-1.962L3 1z"
            fill="#fff"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 1L1 2l18 12 1-1L2 1z"
            fill="#C7152A"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 1h2v2S8.25 10.396 3.018 14.028c-.063.044-1.998.003-1.998.003L.865 12.13 18 1z"
            fill="#fff"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.043.972L20 2 2 14l-1-1L19.043.972z"
            fill="#C7152A"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1h5v4h7v5h-7v4H8v-4H1V5h7V1z"
            fill="#fff"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 1h3v5h8v3h-8v5H9V9H1V6h8V1z"
            fill="#C7152A"
          />
          <path
            d="M19 .5H2A1.5 1.5 0 00.5 2v11A1.5 1.5 0 002 14.5h17a1.5 1.5 0 001.5-1.5V2A1.5 1.5 0 0019 .5z"
            stroke="#000"
            strokeOpacity={0.1}
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_908_30634">
          <path fill="#fff" d="M0 0H21V15H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default EngFlagIcon
