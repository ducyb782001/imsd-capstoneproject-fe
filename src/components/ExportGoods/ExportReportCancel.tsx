import React, { useState } from "react"
import { useQueries } from "react-query"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import { getDetailExportProduct } from "../../apis/export-product-module"
import ExportReportSkeleton from "../Skeleton/ExportReportSkeleton"
import { BigNumber } from "bignumber.js"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"

function ExportReportCanceled() {
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
          Header: t("price"),
          accessor: (data: any) => (
            <div>
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
  const [productExport, setProductExport] = useState<any>()
  const router = useRouter()
  const { exportId } = router.query
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        setProductExport(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!exportId,
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
                #{productExport?.exportCode}
              </h1>
              <div className="px-4 py-1 font-bold text-red-600 bg-red-100 border border-red-600 rounded-2xl">
                {t("cancelled")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                {t("exit")}
              </PrimaryBtn>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar
              status="deny"
              createdDate={format(
                new Date(productExport?.createdDate),
                "dd/MM/yyyy HH:mm",
              )}
              approvedDate={format(
                new Date(productExport?.deniedDate),
                "dd/MM/yyyy HH:mm",
              )}
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("staff")}:</h1>
            </div>
            <PrimaryInput
              value={productExport?.user?.userName}
              readOnly={true}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            {t("additional_information")}
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            {t("date_create")}:{" "}
            {format(new Date(productExport?.createdDate), "dd/MM/yyyy HH:mm")}
          </div>
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title={t("additional_information")}
            placeholder={productExport?.note}
            value={productExport?.note}
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
            data={productExport?.exportOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">{t("price_overall")}</div>
          {new BigNumber(productExport?.totalPrice).toFormat(0)} đ
        </div>
      </div>
    </div>
  )
}

export default ExportReportCanceled
