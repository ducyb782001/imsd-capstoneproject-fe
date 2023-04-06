import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useQueries } from "react-query"
import {
  getDetailImportProduct,
  getProductDetailImportProduct,
} from "../../apis/import-product-module"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import SecondaryBtn from "../SecondaryBtn"
import ImportGoodIcon from "../icons/ImportGoodIcon"

function ImportProductDetail() {
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

  useState<any>([])
  const [productImport, setProductImport] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  useEffect(() => {
    if (productImport) {
      if (productImport?.state != 2) {
        router.push("/manage-import-goods")
      }
    }
  }, [productImport])

  const router = useRouter()
  const { detailCode } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductImport", detailCode],
      queryFn: async () => {
        const detail = await getProductDetailImportProduct(detailCode)
        setProductImport(detail?.data)
        setIsLoadingReport(detail?.data?.isLoading)
        return detail?.data
      },
      enabled: !!detailCode,
    },
  ])

  const handleClickOutBtn = () => {
    router.back()
  }

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid gap-5 grid-cols md:grid-cols-7525">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.importCode}
              </h1>
              <div className="px-4 py-1 bg-green-100 border border-[#3DBB65] text-[#3DBB65] font-bold rounded-2xl">
                Hoàn thành
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/create-return-order/?importId=${productImport?.importId}`}
              >
                <a>
                  <SecondaryBtn className="max-w-[120px]">
                    Trả hàng
                  </SecondaryBtn>
                </a>
              </Link>
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                Thoát
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
              <h1 className="text-xl font-semibold">Nhà cung cấp:</h1>
            </div>
            <PrimaryInput
              readOnly={true}
              value={productImport?.supplier?.supplierName}
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
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <PrimaryInput value={productImport?.user?.email} />
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
            placeholder={productImport?.note}
            value={productImport?.note}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ImportGoodIcon />
          <h1 className="text-xl font-semibold">Thông tin sản phẩm nhập vào</h1>
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
          {new BigNumber(productImport?.totalCost || 0).toFormat()} đ
        </div>
      </div>
    </div>
  )
}

export default ImportProductDetail
