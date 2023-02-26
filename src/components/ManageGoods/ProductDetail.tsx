import React, { useState } from "react"
import SmallTitle from "../SmallTitle"
import BigNumber from "bignumber.js"
import { useQueries } from "react-query"
import { getProductDetail } from "../../apis/product-module"
import { useRouter } from "next/router"
import Table from "../Table"
import Pagination from "../Pagination"
import ProductDetailSkeleton from "../Skeleton/ProductDetailSkeleton"

function ProductDetail() {
  const [detailProduct, setDetailProduct] = useState<any>()
  const router = useRouter()
  const { productId } = router.query
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  useQueries([
    {
      queryKey: ["getProductDetail", productId],
      queryFn: async () => {
        if (productId) {
          const response = await getProductDetail(productId)
          setDetailProduct(response?.data)
          setIsLoadingProduct(response?.data?.isLoading)
          return response?.data
        }
      },
    },
  ])

  return isLoadingProduct ? (
    <ProductDetailSkeleton />
  ) : (
    <div>
      <h1 className="text-3xl font-medium">{detailProduct?.productName}</h1>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>Thông tin sản phẩm</SmallTitle>
        <div className="grid mt-4 md:grid-cols-433">
          <div className="grid grid-cols-2 gap-y-1">
            <ProductInfo
              title="Mã sản phẩm"
              data={detailProduct?.productCode}
            />
            <ProductInfo
              title="Nhà cung cấp"
              data={detailProduct?.supplier?.supplierName}
            />
            <ProductInfo
              title="Loại sản phẩm"
              data={detailProduct?.category?.categoryName}
            />
            <ProductInfo
              title="Tồn kho"
              data={new BigNumber(detailProduct?.inStock).toFormat()}
            />
            <ProductInfo title="Đơn vị tính" data={"Hộp"} />
            <ProductInfo
              title="Giá nhập"
              data={`${new BigNumber(
                detailProduct?.costPrice,
              ).toFormat()} đồng`}
            />
            <ProductInfo
              title="Giá bán"
              data={`${new BigNumber(
                detailProduct?.sellingPrice,
              ).toFormat()} đồng`}
            />
            <ProductInfo
              title="Ngày tạo"
              data={detailProduct?.created}
              // data={formatISO(detailProduct?.created)}
            />
          </div>
          <div>
            <div className="text-gray">Mô tả sản phẩm</div>
            <p>{detailProduct?.description}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            {detailProduct?.image ? (
              <>
                <img
                  className="object-cover w-[150px] h-[150px] rounded-md"
                  alt="product-image"
                  src={detailProduct?.image || `/images/no-image.svg`}
                />
              </>
            ) : (
              <>
                <img
                  className="object-cover w-[100px] h-[100px] rounded-md"
                  alt="product-image"
                  src="/images/no-image.svg"
                />
                <p>Sản phẩm chưa có ảnh</p>
              </>
            )}
          </div>
        </div>
      </div>
      <HistoryProduct />
    </div>
  )
}

export default ProductDetail

function ProductInfo({ title = "", data = "" }) {
  return (
    <>
      <div className="text-gray">{title}</div>
      <div className="text-black">{data}</div>
    </>
  )
}

function HistoryProduct() {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <div className="mt-4 bg-white block-border">
      <SmallTitle>Lịch sử</SmallTitle>
      <div className="mt-4 table-style">
        <Table
          pageSizePagination={10}
          columns={columns}
          data={FAKE_DATA_TEST?.data}
        />
      </div>
      <Pagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={FAKE_DATA_TEST?.total}
      />
    </div>
  )
}

const FAKE_DATA_TEST = {
  total: 4,
  data: [
    {
      type: "import",
      created: "18/02/2023",
      user: "Trung Đức",
      action: "Khởi tạo hàng hóa",
      number: 5,
      inWarehouse: 5,
      code: "test",
    },
    {
      type: "import",
      created: "20/02/2023",
      user: "Trung Đức",
      action: "Nhập hàng vào kho",
      number: 6,
      inWarehouse: 11,
      code: "IMPORT123",
    },
  ],
}
const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Ngày ghi nhận",
        accessor: (data: any) => <p>{data?.created}</p>,
      },
      {
        Header: "Nhân viên",
        accessor: (data: any) => <p>{data?.user}</p>,
      },
      {
        Header: "Hành động",
        accessor: (data: any) => <p>{data?.action}</p>,
      },
      {
        Header: "Số lượng thay đổi",
        // In dev later change + or - by type
        accessor: (data: any) => (
          <p className="text-center">
            {data?.type == "import" ? "+" : "-"}
            {data?.number}
          </p>
        ),
      },
      {
        Header: "Số lượng tồn kho",
        accessor: (data: any) => (
          <p className="text-center">{data?.inWarehouse}</p>
        ),
      },
    ],
  },
]
