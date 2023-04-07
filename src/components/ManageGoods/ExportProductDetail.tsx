import React, { useState } from "react"
import { useQueries } from "react-query"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import {
  getDetailExportProduct,
  getDetailProductExportProduct,
} from "../../apis/export-product-module"
import ExportReportSkeleton from "../Skeleton/ExportReportSkeleton"
import BigNumber from "bignumber.js"
import { format } from "date-fns"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import SecondaryBtn from "../SecondaryBtn"

function ExportProductDetail() {
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
            <p>
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
          ),
        },
      ],
    },
  ]

  const [productImport, setProductImport] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const router = useRouter()
  const { detailCode } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductExport", detailCode],
      queryFn: async () => {
        const response = await getDetailProductExportProduct(detailCode)
        setProductImport(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!detailCode,
    },
  ])

  return isLoadingReport ? (
    <ExportReportSkeleton />
  ) : (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.exportCode}
              </h1>
              <div className="px-4 py-1 bg-green-100 border border-[#3DBB65] text-[#3DBB65] font-bold rounded-2xl">
                Hoàn thành
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/create-return-order/?exportId=${productImport?.exportId}`}
              >
                <a>
                  <SecondaryBtn className="max-w-[120px]">
                    Hoàn hàng
                  </SecondaryBtn>
                </a>
              </Link>
              <PrimaryBtn
                onClick={() => {
                  router.push("/manage-export-orders")
                }}
                className="w-[120px]"
              >
                {t("exit")}
              </PrimaryBtn>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar
              createdDate={
                productImport?.createdDate
                  ? format(
                      new Date(productImport?.createdDate),
                      "dd/MM/yyyy HH:mm",
                    )
                  : format(new Date(), "dd/MM/yyyy HH:mm")
              }
              approvedDate={
                productImport?.approvedDate
                  ? format(
                      new Date(productImport?.approvedDate),
                      "dd/MM/yyyy HH:mm",
                    )
                  : format(new Date(), "dd/MM/yyyy HH:mm")
              }
              succeededDate={
                productImport?.completedDate
                  ? format(
                      new Date(productImport?.completedDate),
                      "dd/MM/yyyy HH:mm",
                    )
                  : format(new Date(), "dd/MM/yyyy HH:mm")
              }
              status="succeed"
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Nhân viên:</h1>
            </div>
            <PrimaryInput
              value={productImport?.user?.userName}
              readOnly={true}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày tạo đơn:{" "}
            {productImport?.createdDate
              ? format(new Date(productImport?.createdDate), "dd/MM/yyyy HH:mm")
              : format(new Date(), "dd/MM/yyyy HH:mm")}
          </div>
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú hóa đơn"
            placeholder={productImport?.note}
            value={productImport?.note}
            readOnly={true}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3">
          <ExportGoodsIcon />
          <h1 className="text-xl font-semibold">Thông tin sản phẩm xuất đi</h1>
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
          {new BigNumber(productImport?.totalPrice).toFormat(0)} đ
        </div>
      </div>
    </div>
  )
}

export default ExportProductDetail
