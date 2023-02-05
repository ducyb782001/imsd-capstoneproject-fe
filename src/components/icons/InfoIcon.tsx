import React from "react"

function InfoIcon(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        opacity={0.4}
        d="M13.617 1.667H6.392c-2.825 0-4.725 1.983-4.725 4.933v6.808c0 2.942 1.9 4.925 4.725 4.925h7.225c2.825 0 4.716-1.983 4.716-4.925V6.6c0-2.95-1.891-4.933-4.716-4.933z"
        fill="#000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.27 6.824a.732.732 0 001.462 0 .732.732 0 00-1.462 0zm1.455 2.644a.73.73 0 00-.73-.729.73.73 0 00-.729.73v3.683a.73.73 0 001.458 0V9.468z"
        fill="#F5F5F5"
      />
    </svg>
  )
}

export default InfoIcon
