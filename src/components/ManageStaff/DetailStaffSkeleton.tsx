import React from "react"

function DetailStaffSkeleton() {
  return (
    <div>
      <div className="bg-white block-border">
        <div className="h-[28px] w-[200px] skeleton-loading" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-73">
          <div>
            <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
              <div className="skeleton-loading h-[46px] w-full" />
              <div className="skeleton-loading h-[46px] w-full" />

              <div className="skeleton-loading h-[46px] w-full" />
            </div>

            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-2">
              <div className="skeleton-loading h-[46px] w-full" />
              <div className="skeleton-loading h-[46px] w-full" />
            </div>
            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-3">
              <div className="skeleton-loading h-[46px] w-full" />
              <div className="skeleton-loading h-[46px] w-full" />
              <div className="skeleton-loading h-[46px] w-full" />
            </div>
            <div className="skeleton-loading h-[100px] mt-6 w-full" />
          </div>
          <div className="flex justify-center w-full h-auto">
            <div className="skeleton-loading w-[200px] h-[200px]" />
          </div>
        </div>

        <div className="h-[50px] w-[182px] mt-6 skeleton-loading" />
      </div>
      <div className="mt-10 bg-white block-border">
        <div className="h-7 w-[200px] skeleton-loading" />
        <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
          <div className="w-full h-[46px] skeleton-loading" />
          <div className="w-full h-[46px] skeleton-loading" />
        </div>
        <div className="w-[1000px] mt-1 h-6 skeleton-loading" />
        <div className="w-[182px] h-[50px] skeleton-loading mt-6" />
      </div>
    </div>
  )
}

export default DetailStaffSkeleton
