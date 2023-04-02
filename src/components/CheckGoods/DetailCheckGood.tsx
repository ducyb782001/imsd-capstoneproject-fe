import { format } from "date-fns"
import React, { useState } from "react"
import { useQueries } from "react-query"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import { getDetailStockTakeProduct } from "../../apis/stocktake-product-module"
import StockTakeSkeleton from "../Skeleton/StockTakeDetailSkeleton"
import { useTranslation } from "react-i18next"
import CheckGoodIcon from "../icons/CheckGoodIcon"
import GeneralIcon from "../icons/GeneralIcon"
import BigNumber from "bignumber.js"

function DetailCheckGood() {
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
            <p className="text-center">
              {new BigNumber(data?.currentStock || 0).isGreaterThan(
                data?.actualStock || 0,
              )
                ? "-"
                : "+"}
              {data?.amountDifferential || "---"}
            </p>
          ),
        },
        {
          Header: t("reason"),
          accessor: (data: any) => <p>{data?.note || "---"}</p>,
        },
      ],
    },
  ]

  const router = useRouter()
  const { checkId } = router.query
  const [productCheckObject, setProductCheckObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  useQueries([
    {
      queryKey: ["getDetailCheckGood"],
      queryFn: async () => {
        const response = await getDetailStockTakeProduct(checkId)
        setProductCheckObject(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!checkId,
    },
  ])

  const handleClickOutBtn = () => {
    router.push("/manage-check-good")
  }

  return isLoadingReport ? (
    <StockTakeSkeleton />
  ) : (
    <div>
      <div className="w-full p-6 mt-6 bg-white block-border">
        <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6">
          <div className="flex items-center gap-3">
            <GeneralIcon />
            <h1 className="text-2xl font-semibold">{t("report_infor")}</h1>
            <StatusDisplay data={productCheckObject?.state} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
              {t("exit")}
            </PrimaryBtn>
          </div>
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
            <p>{productCheckObject?.stocktakeCode}</p>
            <p>
              {productCheckObject?.created
                ? format(
                    new Date(productCheckObject?.created),
                    "dd/MM/yyyy HH:mm",
                  )
                : ""}
            </p>
            <p>{productCheckObject?.createdBy?.userName}</p>
            <p>
              {productCheckObject?.updated
                ? format(
                    new Date(productCheckObject?.updated),
                    "dd/MM/yyyy HH:mm",
                  )
                : "---"}
            </p>
            <p>{productCheckObject?.updatedBy?.userName || "---"}</p>
            <p>{productCheckObject?.note || "---"}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3">
          <CheckGoodIcon />
          <h1 className="text-xl font-semibold">{t("check_good_infor")}</h1>
        </div>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productCheckObject?.stocktakeNoteDetails}
          />
        </div>
      </div>
    </div>
  )
}

export default DetailCheckGood

function StatusDisplay({ data }) {
  const { t } = useTranslation()
  if (data == 2) {
    return (
      <div className="font-medium text-center text-white rounded-lg bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">{t("cancelled")}</h1>
      </div>
    )
  } else if (data == 1) {
    return (
      <div className="font-medium text-center text-white border border-green-500 rounded-lg bg-green-50">
        <h1 className="m-2 ml-3 text-green-500">{t("complete")}</h1>
      </div>
    )
  }
}
