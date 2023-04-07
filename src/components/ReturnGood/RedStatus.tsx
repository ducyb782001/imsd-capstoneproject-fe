import React from "react"

function RedStatus({ status = "", className = "" }) {
  return (
    <div
      className={`px-4 py-1 bg-red-100 border border-red-500 text-red-500 rounded-lg ${className}`}
    >
      {status}
    </div>
  )
}

export default RedStatus
