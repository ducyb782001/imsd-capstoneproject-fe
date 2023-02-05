import React from "react"

function TextDescription({ className = "", children }) {
  return <div className={`text-sm text-gray ${className}`}>{children}</div>
}

export default TextDescription
