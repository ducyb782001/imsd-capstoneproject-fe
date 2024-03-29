import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import {
  approveImportProduct,
  denyImportProduct,
} from "../../apis/import-product-module"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import SecondaryBtn from "../SecondaryBtn"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import { useTranslation } from "react-i18next"
import ImportGoodIcon from "../icons/ImportGoodIcon"
import UnitToolTip from "../UnitToolTip"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ZeroImportReportStatus({ isLoadingReport, productImport }) {
  const { t } = useTranslation()
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
            <p
              title={data?.product?.productName}
              className="truncate-2-line max-w-[100px]"
            >
              {data?.product?.productName}
            </p>
          ),
        },
        {
          Header: t("import_number"),
          accessor: (data: any) => (
            <div>
              {data?.amount ? new BigNumber(data?.amount).toFormat(0) : "---"}
            </div>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <UnitToolTip
              content={
                data?.measuredUnit &&
                `1 ${data?.measuredUnit?.measuredUnitName} = ${
                  data?.measuredUnit?.measuredUnitValue
                } ${data?.defaultMeasuredUnit || "-"}`
              }
            >
              <div>
                {data?.measuredUnit
                  ? data?.measuredUnit?.measuredUnitName
                  : data?.defaultMeasuredUnit || "---"}
              </div>
            </UnitToolTip>
          ),
        },
        {
          Header: t("price"),
          accessor: (data: any) => (
            <p className="text-center">
              {new BigNumber(data?.costPrice || 0).toFormat(0)} đ
            </p>
          ),
        },
        {
          Header: t("discount"),
          accessor: (data: any) => (
            <p className="text-center">{data?.discount} %</p>
          ),
        },
        {
          Header: t("total_price"),
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <div className="px-3 py-2 text-center text-white rounded-md bg-successBtn">
                {new BigNumber(data.amount)
                  .multipliedBy(data.costPrice)
                  .minus(
                    new BigNumber(data.amount)
                      .multipliedBy(data.costPrice)
                      .multipliedBy(data.discount)
                      .dividedBy(100),
                  )
                  .toFormat(0)}{" "}
                đ
              </div>
            </div>
          ),
        },
      ],
    },
  ]
  const [userData, setUserData] = useState<any>()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData != "undefined") {
        setUserData(JSON.parse(userData))
      }
    }
  }, [])

  const router = useRouter()

  const queryClient = useQueryClient()
  const approveImportMutation = useMutation(
    async (importProduct) => {
      return await approveImportProduct(importProduct)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("success_import"))
          queryClient.refetchQueries("getDetailProductImport")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
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

  const handleClickApproveBtn = async (event) => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    event?.preventDefault()
    await approveImportMutation.mutate(productImport?.importId)
  }

  const cancelImportMutation = useMutation(
    async (importProduct) => {
      return await denyImportProduct(importProduct)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("cancel_import"))
          queryClient.refetchQueries("getDetailProductImport")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
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
  const handleClickCancelBtn = (event) => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    event?.preventDefault()
    cancelImportMutation.mutate(productImport?.importId)
  }

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full gap-4 md:flex-nowrap">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.importCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                {t("in_progress")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[100px] !bg-transparent text-dangerous !border-dangerous hover:!bg-[#E9283730]"
                title={t("cancel_confirm_import")}
                handleClickSaveBtn={handleClickCancelBtn}
              >
                {t("deny_order")}
              </ConfirmPopup>
              <SecondaryBtn
                className="w-[100px]"
                onClick={() => {
                  router.push("/import-order-edit/" + productImport?.importId)
                }}
              >
                {t("edit_import")}
              </SecondaryBtn>
              {(userData?.roleId === 1 || userData?.roleId === 2) && (
                <ConfirmPopup
                  className="!w-fit"
                  classNameBtn="w-[120px]"
                  title={t("confirm_import")}
                  handleClickSaveBtn={handleClickApproveBtn}
                >
                  {t("approve")}
                </ConfirmPopup>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            {productImport && (
              <StepBar
                status="pending"
                createdDate={format(
                  new Date(productImport?.createdDate),
                  "dd/MM/yyyy HH:mm",
                )}
              />
            )}
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("supplier")}</h1>
            </div>
            <div className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
              {productImport?.supplier?.supplierName}
            </div>
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            {t("additional_information")}
          </h1>
          {productImport?.createdDate && (
            <div className="text-sm font-medium text-center text-gray">
              {t("created_report_import")}:{" "}
              {format(new Date(productImport?.createdDate), "dd/MM/yyyy HH:mm")}
            </div>
          )}

          <div className="mt-3 text-sm font-bold text-gray">{t("staff")}</div>
          <div className="flex items-center justify-between gap-1 px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
            <div className="flex items-center gap-1">
              <p className="text-gray">{productImport?.user?.userName}</p>
            </div>
          </div>
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title={t("note_report")}
            value={productImport?.note}
            readOnly={true}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ImportGoodIcon />
          <h1 className="text-xl font-semibold">{t("import_product_list")}</h1>
        </div>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productImport?.importOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">{t("price_overall")}</div>
          {new BigNumber(productImport?.totalCost).toFormat(0)} đ
        </div>
      </div>
    </div>
  )
}

export default ZeroImportReportStatus
