import React from "react"
import SearchInput from "../SearchInput"
import SmallTitle from "../SmallTitle"
import SmallTableSkeleton from "./SmallTableSkeleton"
import TableSkeleton from "./TableSkeleton"

function SupplierDetailSkeleton() {
  return (
    <div>
      <div className="bg-white block-border">
        <div>
          <div className="float-left">
            <SmallTitle>Thông tin chung</SmallTitle>
          </div>
          <div className="float-right">
            <div className="skeleton-loading w-[212px] h-[50px]" />
          </div>
        </div>

        <div className="grid grid-cols-2 mt-10 gap-y-1">
          <div className="mt-4 skeleton-loading w-[132px] h-6" />
          <div className="col-span-2 text-black"></div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SupplierInfoSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white block-border">
        <h1 className="text-2xl font-bold">Mặt hàng cung cấp</h1>
        <div className="flex flex-col gap-4 mt-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
            <SearchInput
              placeholder="Tìm kiếm bằng tên sản phẩm"
              className="w-full col-span-3"
            />
          </div>
          <SmallTableSkeleton />
        </div>
      </div>
    </div>
  )
}

export default SupplierDetailSkeleton

function SupplierInfoSkeleton({ title = "", data = "" }) {
  return (
    <div>
      <div className="w-32 h-6 skeleton-loading">{title}</div>
      <div className="w-48 h-6 mt-1 skeleton-loading">{data}</div>
    </div>
  )
}
