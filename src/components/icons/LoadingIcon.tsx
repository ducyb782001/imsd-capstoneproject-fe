import * as React from "react"

function LoadingIcon(props) {
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
        d="M2 10.995A10.053 10.053 0 0110.995 2v2.023a8.044 8.044 0 00-6.972 6.972H2zm0 2.01A10.053 10.053 0 0010.995 22v-2.023a8.044 8.044 0 01-6.972-6.972H2zm17.977 0a8.044 8.044 0 01-6.972 6.972V22A10.053 10.053 0 0022 13.005h-2.023zM22 10.995A10.053 10.053 0 0013.005 2v2.022a8.044 8.044 0 016.972 6.973H22z"
        fill="#0FF"
      />
    </svg>
  )
}

export default LoadingIcon
