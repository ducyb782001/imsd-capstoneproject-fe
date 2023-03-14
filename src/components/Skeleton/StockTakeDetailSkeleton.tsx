import React from "react"
import SmallTableSkeleton from "./SmallTableSkeleton"

function StockTakeSkeleton() {
  return (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Chỉnh sửa kiểm hàng</h1>
          </div>
          <div className="flex items-center justify-between gap-4 skeleton-loading"></div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border skeleton-loading"></div>
      </div>
      <div className="mt-4 bg-white block-border skeleton-loading">
        <h1 className="mb-4 text-xl font-semibold skeleton-loading">
          Thông tin sản phẩm kiểm
        </h1>
        <div className="mt-4 table-style">
          <SmallTableSkeleton />
        </div>
      </div>
    </div>
  )
}
export default StockTakeSkeleton
