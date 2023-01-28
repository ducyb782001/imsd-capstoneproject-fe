import React from "react"

function SearchIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l3.69 3.69a.75.75 0 11-1.06 1.06l-3.69-3.69A8.25 8.25 0 012.25 10.5z"
        fill="#7F7F7F"
      />
    </svg>
  )
}

export default SearchIcon
