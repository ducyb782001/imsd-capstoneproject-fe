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
import { useQueries } from "react-query"
import ReturnTitleIcon from "../icons/ReturnTitleIcon"
import GeneralInformationIcon from "../icons/GeneralInformationIcon"

function ReturnImportDetail() {
  const { t } = useTranslation()

  const [detailReturnImport, setDetailReturnImport] = useState<any>()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: "STT",
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: "Ảnh",
          accessor: (data: any) => (
            <img
              src={data?.product?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: "Tên sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName || "---"}
            </p>
          ),
        },
        {
          Header: "Mã sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode || "---"}
            </p>
          ),
        },
        {
          Header: "Đơn vị",
          accessor: (data: any) => <RenderUnit data={data} />,
        },
        {
          Header: "SL trả",
          accessor: (data: any) => <p>{data?.amount}</p>,
        },
        {
          Header: "Đơn giá trả",
          accessor: (data: any) => (
            <div className="text-center">{data?.price}</div>
          ),
        },
        {
          Header: "Thành tiền",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <div className="px-3 py-2 text-center text-white rounded-md bg-successBtn">
                {new BigNumber(data.amount)
                  .multipliedBy(data.price)
                  .toFormat(0)}{" "}
                đ
              </div>
            </div>
          ),
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
            <PrimaryBtn
              className="w-[120px]"
              onClick={() => router.push("/manage-return-good")}
            >
              {t("exit")}
            </PrimaryBtn>
          </div>
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
            <ProductInfo title={t("note")} data={detailReturnImport?.note} />
          </div>
          <div className="hidden md:block" />
          <div>
            <div className="text-gray">Lý do (ảnh)</div>
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
            data={detailReturnImport?.returnsOrderDetails}
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
