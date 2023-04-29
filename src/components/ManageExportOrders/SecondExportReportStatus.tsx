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
import BigNumber from "bignumber.js"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import SecondaryBtn from "../SecondaryBtn"
import { useTranslation } from "react-i18next"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import UnitToolTip from "../UnitToolTip"

function SecondExportReportStatus({ productImport }) {
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

  const router = useRouter()
  const { exportId } = router.query

  const handleClickOutBtn = (event) => {
    router.push("/manage-export-orders")
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
              <div className="px-4 py-1 bg-green-100 border border-[#3DBB65] text-[#3DBB65] font-bold rounded-2xl">
                {t("complete")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Link href={`/create-return-order/?exportId=${exportId}`}>
                <a>
                  <SecondaryBtn className="max-w-[120px]">
                    {t("hoanhang")}
                  </SecondaryBtn>
                </a>
              </Link>
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                {t("exit")}
              </PrimaryBtn>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar
              createdDate={format(
                parseISO(
                  productImport?.createdDate
                    ? productImport?.createdDate
                    : new Date().toISOString(),
                ),
                "dd/MM/yyyy HH:mm",
              )}
              approvedDate={format(
                new Date(
                  productImport?.approvedDate
                    ? productImport?.approvedDate
                    : new Date().toISOString,
                ),
                "dd/MM/yyyy HH:mm",
              )}
              succeededDate={format(
                new Date(
                  productImport?.completedDate
                    ? productImport?.completedDate
                    : new Date().toISOString,
                ),
                "dd/MM/yyyy HH:mm",
              )}
              status="succeed"
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("staff")}:</h1>
            </div>
            <PrimaryInput
              value={productImport?.user?.userName}
              readOnly={true}
            />
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
                productImport?.createdDate
                  ? productImport?.createdDate
                  : new Date().toISOString(),
              ),
              "dd/MM/yyyy HH:mm",
            )}
          </div>
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title={t("note_report")}
            placeholder={productImport?.note}
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
          {new BigNumber(productImport?.totalPrice).toFormat(0)} đ
        </div>
      </div>
    </div>
  )
}

export default SecondExportReportStatus
