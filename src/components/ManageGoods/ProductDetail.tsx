import React, { useState } from "react"
import SmallTitle from "../SmallTitle"
import BigNumber from "bignumber.js"
import { useQueries } from "react-query"
import { getProductDetail } from "../../apis/product-module"
import { useRouter } from "next/router"
import Table from "../Table"
import Pagination from "../Pagination"
import ProductDetailSkeleton from "../Skeleton/ProductDetailSkeleton"
import { format } from "date-fns"
import Link from "next/link"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  return isLoadingProduct ? (
    <ProductDetailSkeleton />
  ) : (
    <div>
      <h1 className="text-3xl font-medium">{detailProduct?.productName}</h1>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>{t("product_infor")}</SmallTitle>
        <div className="grid mt-4 md:grid-cols-433">
          <div className="grid grid-cols-2 gap-y-1">
            <ProductInfo
              title={t("product code")}
              data={detailProduct?.productCode}
            />
            <ProductInfo
              title={t("supplier")}
              data={detailProduct?.supplier?.supplierName}
            />
            <ProductInfo
              title={t("type.typeGoods")}
              data={detailProduct?.category?.categoryName}
            />
            <ProductInfo
              title={t("in_stock")}
              data={new BigNumber(detailProduct?.inStock).toFormat()}
            />
            <ProductInfo
              title={t("product_unit")}
              data={detailProduct?.defaultMeasuredUnit}
            />
            <ProductInfo
              title={t("cost_price")}
              data={`${new BigNumber(detailProduct?.costPrice).toFormat(0)} ${t(
                "dong",
              )}`}
            />
            <ProductInfo
              title={t("sell_price")}
              data={`${new BigNumber(detailProduct?.sellingPrice).toFormat(
                0,
              )} ${t("dong")}`}
            />
            <ProductInfo
              title={t("date_create")}
              data={format(
                new Date(detailProduct?.created),
                "dd/MM/yyyy HH:mm",
              )}
            />
          </div>
          <div>
            <div className="text-gray">{t("product_description")}</div>
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
      <HistoryProduct data={detailProduct} />
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

function HistoryProduct({ data }) {
  const { t } = useTranslation()
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("code_action"),
          accessor: (data: any) => {
            return <ShowDetailHistory data={data} />
          },
        },
        {
          Header: t("staff"),
          accessor: (data: any) => <p>{data?.user?.userName}</p>,
        },
        {
          Header: t("action"),
          accessor: (data: any) => <p>{data?.actionType?.action}</p>,
        },
        {
          Header: t("amount_change"),
          // In dev later change + or - by type
          accessor: (data: any) => (
            <p className="text-center">{data?.amountDifferential}</p>
          ),
        },
        {
          Header: t("inventory_number"),
          accessor: (data: any) => (
            <p className="text-center">{data?.amount}</p>
          ),
        },
        {
          Header: t("recorded_date"),
          accessor: (data: any) => (
            <p>{format(new Date(data?.date), "dd/MM/yyyy HH:mm")}</p>
          ),
        },
      ],
    },
  ]
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  console.log(data)

  return (
    <div className="mt-4 bg-white block-border">
      <SmallTitle>{t("history")}</SmallTitle>
      <div className="mt-4 table-style">
        <Table
          pageSizePagination={10}
          columns={columns}
          data={data?.productHistories}
        />
      </div>
      <Pagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={data?.productHistories?.length}
      />
    </div>
  )
}

function ShowDetailHistory({ data }) {
  const a = data?.actionCode ? data?.actionCode : ""
  if (data?.actionType?.action == "Kiểm hàng") {
    return (
      <div>
        <Link href={`/check-product-detail/` + a}>
          <p className="cursor-pointer text-blue">{a}</p>
        </Link>
      </div>
    )
  } else if (data?.actionType?.action == "Xuất hàng") {
    return (
      <div>
        <Link href={`/export-product-detail/` + a}>
          <p className="cursor-pointer text-blue">{a}</p>
        </Link>
      </div>
    )
  } else if (data?.actionType?.action == "Nhập hàng") {
    return (
      <div>
        <Link href={`/import-product-detail/` + a}>
          <p className="cursor-pointer text-blue">{a}</p>
        </Link>
      </div>
    )
  }
}
