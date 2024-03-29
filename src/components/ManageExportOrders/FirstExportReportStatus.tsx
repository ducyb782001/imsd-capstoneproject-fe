import React from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { exportExportProduct } from "../../apis/export-product-module"
import BigNumber from "bignumber.js"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import UnitToolTip from "../UnitToolTip"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function FirstExportReportStatus({ productImport }) {
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
            <div className="text-center">
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
              {data?.price ? new BigNumber(data?.price).toFormat(0) : 0} đ
            </p>
          ),
        },
        {
          Header: t("discount"),
          accessor: (data: any) => (
            <p className="text-center">
              {data?.discount ? data?.discount : "---"} %
            </p>
          ),
        },
        {
          Header: t("total_price"),
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <p>
                {new BigNumber(data.amount)
                  .multipliedBy(data.price)
                  .minus(
                    new BigNumber(data.amount)
                      .multipliedBy(data.price)
                      .multipliedBy(data.discount)
                      .dividedBy(100),
                  )
                  .toFormat(0)}
              </p>
            </div>
          ),
        },
      ],
    },
  ]

  const queryClient = useQueryClient()

  const exportExportMutation = useMutation(
    async (importProduct) => {
      return await exportExportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("complete_export_alert"))
          queryClient.refetchQueries("getDetailProductExport")
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

  const handleClickApproveBtn = (event) => {
    event?.preventDefault()
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    exportExportMutation.mutate(productImport?.exportId)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.exportCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                {t("in_export")}
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              {/* <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
                {t("exit")}
              </SecondaryBtn> */}
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title={t("confirm_succeed_export")}
                handleClickSaveBtn={handleClickApproveBtn}
              >
                {t("export")}
              </ConfirmPopup>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            {productImport && (
              <StepBar
                status="approved"
                createdDate={format(
                  new Date(productImport?.createdDate),
                  "dd/MM/yyyy HH:mm",
                )}
                approvedDate={format(
                  new Date(productImport?.approvedDate),
                  "dd/MM/yyyy HH:mm",
                )}
              />
            )}
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("staff")}</h1>
            </div>
            <div
              className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform"
              aria-readonly
            >
              {productImport?.user?.userName}
            </div>
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            {t("additional_information")}
          </h1>
          {productImport && (
            <div className="text-sm font-medium text-center text-gray">
              {t("created_report_import")}:{" "}
              {format(new Date(productImport?.createdDate), "dd/MM/yyyy HH:mm")}
            </div>
          )}
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title={t("note_report")}
            value={productImport?.note}
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
            data={productImport?.exportOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">{t("price_overall")}</div>
          {productImport?.totalPrice}
        </div>
      </div>
    </div>
  )
}

export default FirstExportReportStatus
