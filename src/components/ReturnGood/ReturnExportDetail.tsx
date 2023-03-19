import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createExportProduct } from "../../apis/export-product-module"
import { getListExportProduct } from "../../apis/product-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import Table from "../Table"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import SearchProductImportDropdown from "../ImportGoods/SearchProductImportDropdown"
import { useRouter } from "next/router"
import SecondaryBtn from "../SecondaryBtn"
import DownloadIcon from "../icons/DownloadIcon"
import UploadIcon from "../icons/UploadIcon"
import * as XLSX from "xlsx/xlsx"
import {
  approveStockTakeProduct,
  denyStockTakeProduct,
  getDetailStockTakeProduct,
} from "../../apis/stocktake-product-module"
import StockTakeSkeleton from "../Skeleton/StockTakeDetailSkeleton"
import SmallTitle from "../SmallTitle"
import { useTranslation } from "react-i18next"
import PrimaryBtn from "../PrimaryBtn"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ReturnExportDetail() {
  const { t } = useTranslation()

  const fake_data = {
    returnCode: "TAHA2601",
    returnCost: 160000,
    supplier: "Tây Bắc",
    status: 0,
    create: "Kiểm kho Lâm",
    createDate: Date.now(),
    returnDate: Date.now(),
    note: "Trả hàng lỗi về cho nhà sản xuất",
  }
  const product_fake = [
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
  ]
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: "STT",
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
          Header: t("product_code"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {/* {data?.product?.productCode} */}
              {data?.productCode}
            </p>
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <div>{data?.measuredUnitId ? data?.measuredUnitId : "---"}</div>
          ),
        },
        {
          Header: t("type.type"),
          accessor: (data: any) => (
            <div>{data?.category ? data?.category : "---"}</div>
          ),
        },
        {
          Header: t("return_amount"),
          accessor: (data: any) => (
            <div>{data?.returnAmount ? data?.returnAmount : "---"}</div>
          ),
        },
        {
          Header: t("price"),
          accessor: (data: any) => (
            <p className="text-center">
              {new BigNumber(data.price).toFormat(0)} đ
            </p>
          ),
        },
        {
          Header: t("total_price"),
          accessor: (data: any) => (
            <p>{new BigNumber(data.costPrice).toFormat(0)} đ</p>
          ),
        },
      ],
    },
  ]

  const [productStockTakeObject, setProductStockTakeObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const router = useRouter()
  const { returnId } = router.query

  useQueries([
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getDetailStockTakeProduct(returnId)
        setProductStockTakeObject(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!returnId,
    },
  ])

  const handleClickOutBtn = (event) => {
    router.push("/manage-return-good")
  }

  return isLoadingReport ? (
    <StockTakeSkeleton />
  ) : (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-4"></div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <SmallTitle>{t("product_infor")}</SmallTitle>

              <div className="px-4 py-1 bg-green-100 border border-[#3DBB65] text-[#3DBB65] font-bold rounded-2xl">
                {t("final")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <PrimaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
                {t("exit")}
              </PrimaryBtn>
            </div>
          </div>
          <div className="grid mt-4 md:grid-cols-433">
            <div className="grid grid-cols-2 gap-y-1">
              <ProductInfo
                title={t("return_code")}
                data={fake_data?.returnCode}
              />
              <ProductInfo title={t("return_to")} data={fake_data?.supplier} />
              <ProductInfo
                title={t("return_date")}
                data={format(fake_data?.createDate, "dd/MM/yyyy HH:mm")}
              />

              <ProductInfo
                title={t("staff_created")}
                data={fake_data?.create}
              />
              <ProductInfo title={t("note")} data={fake_data?.note} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          {t("return_product_detail")}
        </h1>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={product_fake}
          />
        </div>
      </div>
    </div>
  )
}
function ProductInfo({ title = "", data = "" }) {
  return (
    <>
      <div className="text-gray">{title}</div>
      <div className="text-black">{data}</div>
    </>
  )
}
export default ReturnExportDetail
