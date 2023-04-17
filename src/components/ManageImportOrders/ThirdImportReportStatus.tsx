import React from "react"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { BigNumber } from "bignumber.js"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import ImportGoodIcon from "../icons/ImportGoodIcon"
import UnitToolTip from "../UnitToolTip"

function ThirdImportReportStatus({ productImport }) {
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

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 grid-cols md:grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.importCode}
              </h1>
              <div className="px-4 py-1 font-bold text-red-600 bg-red-100 border border-red-600 rounded-2xl">
                {t("cancelled")}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar
              status="deny"
              createdDate={format(
                new Date(productImport?.createdDate),
                "dd/MM/yyyy HH:mm",
              )}
              approvedDate={format(
                new Date(productImport?.deniedDate),
                "dd/MM/yyyy HH:mm",
              )}
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("supplier") + ": "}</h1>
            </div>
            <PrimaryInput
              value={productImport?.supplier?.supplierName}
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
            {format(new Date(productImport?.createdDate), "dd/MM/yyyy HH:mm")}
          </div>

          <div className="mt-3 text-sm font-bold text-gray">{t("staff")}</div>
          <PrimaryInput value={productImport?.user?.email} readOnly={true} />
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title={t("note_report")}
            placeholder={productImport?.note}
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
          {new BigNumber(productImport?.totalCost || 0).toFormat()}
        </div>
      </div>
    </div>
  )
}

export default ThirdImportReportStatus
