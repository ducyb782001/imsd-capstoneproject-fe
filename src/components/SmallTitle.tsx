import React from "react"

function SmallTitle({ className = "", children }) {
  return (
    <p
      className={`text-base md:text-xl font-semibold text-grayDark ${className}`}
    >
      {children}
    </p>
  )
}

export default SmallTitle
