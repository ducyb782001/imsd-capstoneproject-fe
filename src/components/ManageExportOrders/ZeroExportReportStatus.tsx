import BigNumber from "bignumber.js"
import { format, parseISO } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import {
  approveExportProduct,
  denyExportProduct,
  getDetailExportProduct,
} from "../../apis/export-product-module"
import SecondaryBtn from "../SecondaryBtn"
import ExportReportSkeleton from "../Skeleton/ExportReportSkeleton"
import { useTranslation } from "react-i18next"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import UnitToolTip from "../UnitToolTip"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ZeroExportReportStatus({ productImportObject }) {
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
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName}
            </p>
          ),
        },
        {
          Header: t("export_number"),
          accessor: (data: any) => (
            <div>{data?.amount ? data?.amount : "---"}</div>
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
            <p className="text-center">{data?.price} đ</p>
          ),
        },
        {
          Header: t("discount"),
          accessor: (data: any) => (
            <div>
              <p className="text-center">{data?.discount} %</p>
            </div>
          ),
        },
        {
          Header: t("total_price"),
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <p className="text-center">
                {new BigNumber(data.amount)
                  .multipliedBy(data.price)
                  .minus(
                    new BigNumber(data.amount)
                      .multipliedBy(data.price)
                      .multipliedBy(data.discount)
                      .dividedBy(100),
                  )
                  .toFormat(0)}{" "}
                đ
              </p>
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
  const queryClient = useQueryClient()

  const approveImportMutation = useMutation(
    async (importProduct) => {
      return await approveExportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("export_approve_success"))
          queryClient.invalidateQueries("getDetailProductExport")
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

  const router = useRouter()

  const handleClickApproveBtn = (event) => {
    event?.preventDefault()
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })

    approveImportMutation.mutate(productImportObject?.exportId)
  }

  const cancelImportMutation = useMutation(
    async (importProduct) => {
      return await denyExportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("export_deny_success"))
          queryClient.invalidateQueries("getDetailProductExport")
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
    event?.preventDefault()
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    cancelImportMutation.mutate(productImportObject?.exportId)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImportObject?.exportCode}
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
                  router.push(
                    "/export-order-edit/" + productImportObject?.exportId,
                  )
                }}
              >
                {t("edit_import")}
              </SecondaryBtn>
              {(userData?.roleId === 1 || userData?.roleId === 2) && (
                <ConfirmPopup
                  className="!w-fit"
                  classNameBtn="w-[120px]"
                  title={t("approve_export_alert")}
                  handleClickSaveBtn={handleClickApproveBtn}
                >
                  {t("approve")}
                </ConfirmPopup>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar createdDate={format(Date.now(), "dd/MM/yyyy HH:mm")} />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("choose_staff")}</h1>
            </div>
            <div className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
              {productImportObject?.user?.userName}
            </div>
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            {t("additional_information")}
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            {t("created_report_import")}:{" "}
            {format(
              parseISO(
                productImportObject?.createdDate
                  ? productImportObject?.createdDate
                  : new Date().toISOString(),
              ),
              "dd/MM/yyyy HH:mm",
            )}
          </div>
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title={t("note_report")}
            value={productImportObject?.note}
            readOnly={true}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ExportGoodsIcon />
          <h1 className="text-xl font-semibold">{t("export_product_infor")}</h1>
        </div>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productImportObject?.exportOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">{t("price_overall")}</div>
          {new BigNumber(productImportObject?.totalPrice).toFormat(0)} đ
        </div>
      </div>
    </div>
  )
}

export default ZeroExportReportStatus
