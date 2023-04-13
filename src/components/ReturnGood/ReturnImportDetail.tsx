import BigNumber from "bignumber.js"
import { format, parseISO } from "date-fns"
import React, { useState } from "react"
import Table from "../Table"
import { useRouter } from "next/router"
import StockTakeSkeleton from "../Skeleton/StockTakeDetailSkeleton"
import SmallTitle from "../SmallTitle"
import { useTranslation } from "react-i18next"
import PrimaryBtn from "../PrimaryBtn"
import { getDetailReturnImport } from "../../apis/return-product-module"
import { useMutation, useQueries, useQueryClient } from "react-query"
import ReturnTitleIcon from "../icons/ReturnTitleIcon"
import GeneralInformationIcon from "../icons/GeneralInformationIcon"
import SecondaryBtn from "../SecondaryBtn"
import YellowStatus from "./YellowStatus"
import GreenStatus from "./GreenStatus"
import { toast } from "react-toastify"
import { importReturnProduct } from "../../apis/import-product-module"
import ConfirmPopup from "../ConfirmPopup"

const TOAST_IMPORT_PRODUCT_TYPE_ID = "toast-import-product-type-id"

function ReturnImportDetail() {
  const { t } = useTranslation()

  const [detailReturnImport, setDetailReturnImport] = useState<any>()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("no"),
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
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName || "---"}
            </p>
          ),
        },
        {
          Header: t("product code"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode || "---"}
            </p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => <RenderUnit data={data} />,
        },
        {
          Header: t("return_amount"),
          accessor: (data: any) => <p>{data?.amount}</p>,
        },
      ],
    },
  ]

  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const router = useRouter()

  const { returnId } = router.query

  useQueries([
    {
      queryKey: ["getDetailReturnImport", returnId],
      queryFn: async () => {
        const response = await getDetailReturnImport(returnId)
        setDetailReturnImport(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!returnId,
    },
  ])

  const handleClickImportReturnGood = async (event) => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_IMPORT_PRODUCT_TYPE_ID,
    })
    event?.preventDefault()
    await approveImportMutation.mutate(returnId)
  }
  const queryClient = useQueryClient()
  const approveImportMutation = useMutation(
    async (importProduct: any) => {
      return await importReturnProduct(importProduct)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_IMPORT_PRODUCT_TYPE_ID)
          toast.success(t("import_product_return_success"))
          queryClient.refetchQueries("getDetailReturnImport")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data || "Error")
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                t("error_occur"),
            )
          }
        }
      },
    },
  )

  return isLoadingReport ? (
    <StockTakeSkeleton />
  ) : (
    <div>
      <div className="w-full p-6 mt-6 bg-white block-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <GeneralInformationIcon />
            <SmallTitle>{t("product_infor")}</SmallTitle>
          </div>
          <div className="flex items-center justify-between gap-4">
            <SecondaryBtn className="w-[120px]" onClick={() => router.back()}>
              {t("exit")}
            </SecondaryBtn>
            {detailReturnImport?.state === 0 && (
              <ConfirmPopup
                className="!w-fit"
                // classNameBtn="w-[120px]"
                title={t("confirm_import_return_order")}
                handleClickSaveBtn={handleClickImportReturnGood}
              >
                {t("reimport")}
              </ConfirmPopup>
            )}
          </div>
        </div>
        <div className="text-center">
          {detailReturnImport?.state === 0 && (
            <YellowStatus
              className="max-w-[150px]"
              status={t("in_return_progress")}
            />
          )}
          {detailReturnImport?.state === 1 && (
            <GreenStatus
              className="max-w-[200px]"
              status={t("reimport_succeed")}
            />
          )}
        </div>
        <div className="grid grid-cols-1 mt-4 md:grid-cols-502030">
          <div className="grid grid-cols-2 gap-y-4">
            <ProductInfo
              title={t("return_code")}
              data={detailReturnImport?.returnsCode}
            />
            {detailReturnImport?.supplierId && (
              <ProductInfo
                title={t("return_to")}
                data={detailReturnImport?.supplier?.supplierName}
              />
            )}
            <ProductInfo
              title={t("return_date")}
              data={format(
                parseISO(
                  detailReturnImport?.created
                    ? detailReturnImport?.created
                    : new Date().toISOString(),
                ),
                "dd/MM/yyyy HH:mm",
              )}
            />

            <ProductInfo
              title={t("staff_created")}
              data={`${detailReturnImport?.user?.userName}`}
            />
            <ProductInfo
              title={t("note")}
              data={detailReturnImport?.note || "---"}
            />
          </div>
          <div className="hidden md:block" />
          <div>
            <div className="text-gray">{t("reasone_img")}</div>
            <img
              alt="reason-img"
              className="max-h-[200px] object-cover max-w-[350px]"
              src={
                detailReturnImport?.media
                  ? detailReturnImport?.media
                  : "/images/default-product-image.jpg"
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-2 mb-4">
          <ReturnTitleIcon />
          <h1 className="text-xl font-semibold">
            {t("return_product_detail")}
          </h1>
        </div>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={detailReturnImport?.returnsOrderDetail}
          />
        </div>
      </div>
    </div>
  )
}
export default ReturnImportDetail

function ProductInfo({ title = "", data = "" }) {
  return (
    <>
      <div className="text-gray">{title}</div>
      <div className="text-black">{data}</div>
    </>
  )
}

function RenderUnit({ data }) {
  return (
    <p className="truncate-2-line max-w-[100px]">
      {data?.measuredUnitId
        ? data?.product?.measuredUnits.filter(
            (i) => i.measuredUnitId === data?.measuredUnitId,
          )[0].measuredUnitName
        : data?.defaultMeasuredUnit}
    </p>
  )
}
