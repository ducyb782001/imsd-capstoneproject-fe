import React from "react"

function TextDescription({ className = "", children }) {
  return <p className={`text-sm text-gray ${className}`}>{children}</p>
}

export default TextDescription
