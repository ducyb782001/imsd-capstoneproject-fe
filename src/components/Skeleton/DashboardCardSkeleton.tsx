import React from "react"

function DashboardCardSkeleton() {
  return (
    <div className="px-3 py-4 border rounded-xl border-grayLight drop-shadow-md">
      <div className="h-7 w-[100px] skeleton-loading" />
      <div className="w-full h-8 mt-1 skeleton-loading" />
    </div>
  )
}

export default DashboardCardSkeleton
