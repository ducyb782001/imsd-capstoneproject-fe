import React from "react"

function YellowStatus({ status = "", className = "" }) {
  return (
    <div
      className={`px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-center text-[#D69555] rounded-lg ${className}`}
    >
      {status}
    </div>
  )
}

export default YellowStatus
