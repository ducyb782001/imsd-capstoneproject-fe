import React from "react"
import SmallTableSkeleton from "./SmallTableSkeleton"

function ImportReportSkeleton() {
  return (
    <div>
      <div className="grid gap-5 grid-cols md:grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="skeleton-loading h-[34px] w-[300px]" />
            <div className="skeleton-loading h-[50px] w-[120px]" />
          </div>
          <div className="flex justify-center mt-6">
            <div className="skeleton-loading w-[668px] h-[96px]" />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton-loading h-7 w-[132px]" />
            </div>
            <div className="w-full h-[46px] skeleton-loading" />
          </div>
        </div>
        <div className="bg-white block-border">
          <div className="text-center w-[200px] h-7 skeleton-loading" />
          <div className="w-full h-5 text-center skeleton-loading" />
          <div className="w-24 h-5 mt-3 skeleton-loading" />
          <div className="w-full mt-1 skeleton-loading h-[46px]" />
          <div className="w-24 h-5 mt-1 skeleton-loading" />
          <div className="skeleton-loading mt-1 w-full h-[106px]" />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="mb-4 h-7 w-[450px] skeleton-loading" />
        <SmallTableSkeleton />
      </div>
    </div>
  )
}

export default ImportReportSkeleton
