import BigNumber from "bignumber.js"
import { format, parseISO } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
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
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ExportReportDraff() {
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
            <div>
              {data?.measuredUnit
                ? data?.measuredUnit?.measuredUnitName
                : data?.defaultMeasuredUnit}
            </div>
          ),
        },
        {
          Header: t("price"),
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <p className="text-center">{data?.price} đ</p>
            </div>
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

  const [productImportObject, setProductImportObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const approveImportMutation = useMutation(
    async (importProduct) => {
      return await approveExportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("export_approve_success"))
          router.push("/export-report-detail/" + productImportObject?.exportId)
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
            )
          }
        }
      },
    },
  )

  const router = useRouter()
  const { exportId } = router.query

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
          router.push("/manage-export-goods")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
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

  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        setProductImportObject(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
    },
  ])
  const handleClickOutBtn = (event) => {
    router.push("/manage-export-goods")
  }

  return isLoadingReport ? (
    <ExportReportSkeleton />
  ) : (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImportObject?.exportCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                {t("wait_accept_import")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
                {t("exit")}
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[60px] !bg-transparent text-cancelBtn !border-cancelBtn hover:!bg-[#ED5B5530]"
                title={t("cancel_confirm_import")}
                handleClickSaveBtn={handleClickCancelBtn}
              >
                {t("cancel")}
              </ConfirmPopup>
              <SecondaryBtn
                className="w-[115px] !border-blue hover:bg-[#3388F730] text-blue active:bg-blueDark active:border-blueDark "
                onClick={() => {
                  router.push(
                    "/export-report-edit/" + productImportObject?.exportId,
                  )
                }}
              >
                {t("edit_import")}
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title={t("approve_export_alert")}
                handleClickSaveBtn={handleClickApproveBtn}
              >
                {t("approve")}
              </ConfirmPopup>
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
        <h1 className="mb-4 text-xl font-semibold">
          {t("export_product_infor")}
        </h1>
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

export default ExportReportDraff
