import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  getDetailImportProduct,
  importImportProduct,
} from "../../apis/import-product-module"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SecondaryBtn from "../SecondaryBtn"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import { useTranslation } from "react-i18next"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ImportReportDetail() {
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
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName}
            </p>
          ),
        },
        {
          Header: t("import_number"),
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
            <p className="text-center">{data?.costPrice} đ</p>
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
  const [productImport, setProductImport] = useState<any>()
  const router = useRouter()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  useEffect(() => {
    if (productImport) {
      if (productImport?.state != 1) {
        router.push("/manage-import-goods")
      }
    }
  }, [productImport])
  const { importId } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductImport", importId],
      queryFn: async () => {
        const response = await getDetailImportProduct(importId)
        setProductImport(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!importId,
    },
  ])

  const importImportMutation = useMutation(
    async (importProduct) => {
      return await importImportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("import_success"))
          router.push("/import-report-succeed/" + productImport?.importId)
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
    importImportMutation.mutate(productImport?.importId)
  }

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.importCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                {t("wait_get_product")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="min-w-[120px]"
                title={t("confirm_receive_instock")}
                handleClickSaveBtn={handleClickApproveBtn}
              >
                {t("receive_goods")}
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
              <h1 className="text-xl font-semibold">Nhà cung cấp</h1>
            </div>
            <div className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
              {productImport?.supplier?.supplierName}
            </div>
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          {productImport && (
            <div className="text-sm font-medium text-center text-gray">
              Ngày tạo đơn:{" "}
              {format(new Date(productImport?.createdDate), "dd/MM/yyyy HH:mm")}
            </div>
          )}

          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <div className="flex items-center justify-between gap-1 px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
            <div className="flex items-center gap-1">
              <p className="text-gray">{productImport?.user?.userName}</p>
            </div>
          </div>
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
            value={productImport?.note}
            readOnly={true}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          Thông tin sản phẩm nhập vào
        </h1>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productImport?.importOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">Tổng giá trị đơn hàng:</div>
          {new BigNumber(productImport?.totalCost).toFormat()} đ
        </div>
      </div>
    </div>
  )
}

export default ImportReportDetail
