import React from "react"
import SmallTableSkeleton from "./SmallTableSkeleton"

function ProductDetailSkeleton() {
  return (
    <div>
      <div className="w-60 skeleton-loading h-9" />
      <div className="mt-4 bg-white block-border">
        <div className="w-[500px] h-[28px] skeleton-loading" />
        <div className="grid mt-4 md:grid-cols-433">
          <div className="grid grid-cols-2 gap-y-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductInfoSkeleton key={i} />
            ))}
          </div>
          <div>
            <div className="w-16 h-6 skeleton-loading" />
            <div className="w-full h-[200px] mt-1 skeleton-loading" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="h-[200px] w-[200px] skeleton-loading" />
          </div>
        </div>
      </div>
      <HistoryProductSkeleton />
    </div>
  )
}

export default ProductDetailSkeleton

function ProductInfoSkeleton({ title = "", data = "" }) {
  return (
    <>
      <div className="w-32 h-6 skeleton-loading">{title}</div>
      <div className="w-16 h-6 skeleton-loading">{data}</div>
    </>
  )
}

function HistoryProductSkeleton() {
  return (
    <div className="mt-4 bg-white block-border">
      <div className="skeleton-loading w-[300px] h-[28px]" />
      <SmallTableSkeleton />
    </div>
  )
}
