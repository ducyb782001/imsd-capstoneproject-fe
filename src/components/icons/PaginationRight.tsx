import React from "react"

function PaginationRight(props) {
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
        d="M13.47 9.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06L18.94 16l-5.47-5.47a.75.75 0 010-1.06z"
        fill="#999"
      />
      <rect x={0.5} y={0.5} width={31} height={31} rx={3.5} stroke="#EFEAFA" />
    </svg>
  )
}

export default PaginationRight
