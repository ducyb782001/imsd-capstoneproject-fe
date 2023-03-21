import { format } from "date-fns"
import React, { useState } from "react"
import { useQueries } from "react-query"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import { getDetailStockTakeProduct } from "../../apis/stocktake-product-module"
import StockTakeSkeleton from "../Skeleton/StockTakeDetailSkeleton"
import { useTranslation } from "react-i18next"

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
            <div className="flex items-center gap-2">
              <p className="text-center">{data?.currentStock}</p>
            </div>
          ),
        },
        {
          Header: t("actual_stock"),
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <p className="text-center">{data?.actualStock}</p>
            </div>
          ),
        },
        {
          Header: t("deviated"),
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <p className="text-center">{data?.amountDifferential}</p>
            </div>
          ),
        },
        {
          Header: t("reason"),
          accessor: (data: any) => <NoteProduct data={data} />,
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
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-4"></div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center justify-between w-full mb-10">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">{t("report_infor")}</h1>
              <StatusDisplay data={productCheckObject?.state} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                {t("exit")}
              </PrimaryBtn>
            </div>
          </div>
          <div className="grid gap-5 grid-cols md: grid-cols-5">
            <div>
              <p className="font-bold mb-1">{t("check_code")}:</p>
              <p className="font-bold mb-1">{t("created_report_import")}:</p>
              <p className="font-bold mb-1">{t("staff_created")}:</p>
              <p className="font-bold mb-1">{t("check_date")}:</p>
              <p className="font-bold mb-1">{t("check_staff")}:</p>
              <p className="font-bold mb-1">{t("note")}:</p>
            </div>
            <div>
              <p className="mb-1">{productCheckObject?.stocktakeCode}</p>
              <p className="mb-1">
                {productCheckObject?.created
                  ? format(
                      new Date(productCheckObject?.created),
                      "dd/MM/yyyy HH:mm",
                    )
                  : ""}
              </p>
              <p className="mb-1">{productCheckObject?.createdBy?.userName}</p>
              <p className="mb-1">
                {productCheckObject?.updated
                  ? format(
                      new Date(productCheckObject?.updated),
                      "dd/MM/yyyy HH:mm",
                    )
                  : ""}
              </p>
              <p className="mb-1">{productCheckObject?.updatedBy?.userName}</p>
              <p className="mb-1">{productCheckObject?.note}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">{t("check_good_infor")}</h1>
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
      <div className="w-32 font-medium text-center text-white rounded-2xl bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">{t("cancelled")}</h1>
      </div>
    )
  } else if (data == 1) {
    return (
      <div className="w-32 font-medium text-center text-white border border-green-500 bg-green-50 rounded-2xl">
        <h1 className="m-2 ml-3 text-green-500">{t("complete")}</h1>
      </div>
    )
  }
}

function NoteProduct({ data }) {
  const { t } = useTranslation()

  if (data.id == 1) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-center">{t("other")}</p>
      </div>
    )
  } else if (data.id == 2) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-center">{t("damaged")}</p>
      </div>
    )
  } else if (data.id == 3) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-center">{t("return")}</p>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2">
        <p className="text-center">---</p>
      </div>
    )
  }
}
