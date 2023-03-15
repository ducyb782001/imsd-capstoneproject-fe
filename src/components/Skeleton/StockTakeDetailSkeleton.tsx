import React from "react"
import SmallTableSkeleton from "./SmallTableSkeleton"

function StockTakeSkeleton() {
  return (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-semibold skeleton-loading h-[32px] w-[230]"></div>
          </div>
          <div className="flex items-center justify-between gap-4 skeleton-loading h-[50px] w-[448px]"></div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-xl font-semibold skeleton-loading h-[28px] w-[130px]"></div>
          </div>
          <div className="mb-2 text-sm font-bold text-gray skeleton-loading h-[20px] w-[250px]"></div>
          <div className="w-64">
            <div className="mb-2 text-sm font-bold text-gray skeleton-loading h-[20px] w-[100px]"></div>
            <div
              className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform skeleton-loading h-[50px] w-[256px]"
              aria-readonly
            ></div>
          </div>
          <div className="form-group mt-4">
            <div className="skeleton-loading h-[20px] w-[100px]"></div>
            <div className="skeleton-loading h-[166px] w-full mt-2"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold skeleton-loading h-[28px] w-[150px]"></h1>
        <div className="mt-4 table-style">
          <SmallTableSkeleton />
        </div>
      </div>
    </div>
  )
}
export default StockTakeSkeleton
