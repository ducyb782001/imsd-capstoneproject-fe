import React from "react"

function GreenStatus({ status = "", className = "" }) {
  return (
    <div
      className={`text-center px-4 py-1 bg-green-100 border border-[#3DBB65] text-[#3DBB65] rounded-lg ${className}`}
    >
      {status}
    </div>
  )
}

export default GreenStatus
