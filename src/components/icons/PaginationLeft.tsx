import React from "react"

function PaginationLeft(props) {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.53 22.53a.75.75 0 01-1.06 0l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 111.06 1.06L13.06 16l5.47 5.47a.75.75 0 010 1.06z"
        fill="#999"
      />
      <rect x={0.5} y={0.5} width={31} height={31} rx={3.5} stroke="#EFEAFA" />
    </svg>
  )
}

export default PaginationLeft
