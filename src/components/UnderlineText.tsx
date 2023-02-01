import React from "react"

function UnderlineText({ className = "", children ,onClick = null}) {
  return (
    <span
      className={`cursor-pointer text-primary hover:underline ${className}`} 
      onClick={onClick}
    >
      {children}
    </span>
  )
}

export default UnderlineText