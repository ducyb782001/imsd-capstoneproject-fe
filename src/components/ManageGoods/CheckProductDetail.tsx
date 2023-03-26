import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import Table from "../Table"
import { useRouter } from "next/router"
import {
  getDetailStockTakeProduct,
  getProductDetailStockTakeProduct,
} from "../../apis/stocktake-product-module"
import { useTranslation } from "react-i18next"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import GeneralIcon from "../icons/GeneralIcon"

function CheckProductDetail() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("numerical_order"),
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: t("image"),
          accessor: (data: any) => (
            <img
              src={data?.product?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: t("product_code"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode}
            </p>
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName}
            </p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <p className="text-center">
                {data?.measuredUnitId
                  ? data?.measuredUnit.measuredUnitName
                  : data?.product?.defaultMeasuredUnit}
              </p>
            </div>
          ),
        },
        {
          Header: t("current_stock"),
          accessor: (data: any) => (
            <p className="text-center">{data?.currentStock}</p>
          ),
        },
        {
          Header: t("actual_stock"),
          accessor: (data: any) => (
            <p className="text-center">{data?.actualStock}</p>
          ),
        },
        {
          Header: t("deviated"),
          accessor: (data: any) => (
            <p className="text-center">{data?.amountDifferential}</p>
          ),
        },
        {
          Header: t("reason"),
          accessor: (data: any) => <p>{data?.note}</p>,
        },
      ],
    },
  ]

  const router = useRouter()
  const { detailCode } = router.query
  const [productStockTakeObject, setProductStockTakeObject] = useState<any>()

  useQueries([
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getProductDetailStockTakeProduct(detailCode)
        setProductStockTakeObject(response?.data)
        return response?.data
      },
      enabled: !!detailCode,
    },
  ])

  return (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-4"></div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-3 mb-10">
            <GeneralIcon />
            <h1 className="text-2xl font-semibold">Thông tin đơn</h1>
            <StatusDisplay data={productStockTakeObject?.state} />
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <p>{t("check_code")}:</p>
              <p>{t("created_report_import")}:</p>
              <p>{t("staff_created")}:</p>
              <p>{t("check_date")}:</p>
              <p>{t("check_staff")}:</p>
              <p>{t("note")}:</p>
            </div>
            <div className="flex flex-col gap-1">
              <p>{productStockTakeObject?.stocktakeCode}</p>
              <p>
                {productStockTakeObject?.created
                  ? format(
                      new Date(productStockTakeObject?.created),
                      "dd/MM/yyyy HH:mm",
                    )
                  : ""}
              </p>
              <p>{productStockTakeObject?.createdBy?.userName}</p>
              <p>
                {productStockTakeObject?.updated
                  ? format(
                      new Date(productStockTakeObject?.updated),
                      "dd/MM/yyyy HH:mm",
                    )
                  : ""}
              </p>
              <p>{productStockTakeObject?.updatedBy?.userName}</p>
              <p>{productStockTakeObject?.note || "---"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3">
          <ExportGoodsIcon />
          <h1 className="text-xl font-semibold">Thông tin sản phẩm xuất</h1>
        </div>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productStockTakeObject?.stocktakeNoteDetails}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckProductDetail

function StatusDisplay({ data }) {
  if (data == 2) {
    return (
      <div className="w-32 font-medium text-center text-white rounded-lg bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">Đã hủy</h1>
      </div>
    )
  } else if (data == 1) {
    return (
      <div className="w-32 font-medium text-center text-white border border-green-500 rounded-lg bg-green-50">
        <h1 className="m-2 ml-3 text-green-500">Hoàn thành</h1>
      </div>
    )
  }
}
