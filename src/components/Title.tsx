import React, { Children } from "react"

function Title({ className = "text-4xl", children }) {
  return (
    <p className={`text-grayDark font-semibold ${className}`}>{children}</p>
  )
}

export default Title
