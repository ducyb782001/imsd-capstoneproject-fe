import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createExportProduct } from "../../apis/export-product-module"
import { getListExportProduct } from "../../apis/product-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import Table from "../Table"
import { useRouter } from "next/router"
import DownloadIcon from "../icons/DownloadIcon"
import UploadIcon from "../icons/UploadIcon"
import * as XLSX from "xlsx/xlsx"
import PrimaryBtn from "../PrimaryBtn"
import { getDetailStockTakeProduct } from "../../apis/stocktake-product-module"

function DetailCheckReport() {
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
          Header: "Mã sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode}
            </p>
          ),
        },
        {
          Header: "Tên sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName}
            </p>
          ),
        },
        {
          Header: "Đơn vị",
          accessor: (data: any) => (
            <PrimaryInput
              value={
                data?.measuredUnitId
                  ? data?.measuredUnit
                  : data?.product?.defaultMeasuredUnit
              }
              className="w-16"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Tồn chi nhánh",
          accessor: (data: any) => (
            <div className="flex items-center max-w-[70px]">
              <PrimaryInput
                value={data?.currentStock}
                className="w-16"
                readOnly={true}
              />
            </div>
          ),
        },
        {
          Header: "Tồn thực tế",
          accessor: (data: any) => (
            <div className="flex items-center max-w-[80px]">
              <PrimaryInput
                value={data?.actualStock}
                className="w-16"
                readOnly={true}
              />
            </div>
          ),
        },
        {
          Header: "Lệch",
          accessor: (data: any) => (
            <PrimaryInput
              value={data?.amountDifferential}
              className="w-16"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Ghi chú",
          accessor: (data: any) => (
            <PrimaryInput value={data?.note} className="w-16" readOnly={true} />
          ),
        },
      ],
    },
  ]

  const router = useRouter()
  const { checkId } = router.query
  const [productStockTakeObject, setProductStockTakeObject] = useState<any>()
  console.log(productStockTakeObject)
  useQueries([
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getDetailStockTakeProduct(checkId)
        setProductStockTakeObject(response?.data)
        return response?.data
      },
      enabled: !!checkId,
    },
  ])

  const handleClickOutBtn = (event) => {
    router.push("/manage-check-good")
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-4"></div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center justify-between w-full mb-10">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Thông tin đơn</h1>
              <StatusDisplay data={productStockTakeObject?.state} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                Thoát
              </PrimaryBtn>
            </div>
          </div>

          <div className="flex items-center gap-12 text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Mã đơn kiểm hàng:</p>
            <p>{productStockTakeObject?.stocktakeCode}</p>
          </div>
          <div className="flex items-center gap-20 text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Ngày tạo đơn:</p>
            <p>
              {productStockTakeObject?.created
                ? format(
                    new Date(productStockTakeObject?.created),
                    "dd/MM/yyyy HH:mm",
                  )
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-12 text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Nhân viên tạo đơn:</p>
            <p>{productStockTakeObject?.createdBy?.userName}</p>
          </div>
          <div className="flex items-center gap-[72px] text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Ngày cân bằng:</p>
            <p>
              {productStockTakeObject?.updated
                ? format(
                    new Date(productStockTakeObject?.updated),
                    "dd/MM/yyyy HH:mm",
                  )
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-10 text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Nhân viên cân bằng:</p>
            <p>{productStockTakeObject?.updatedBy?.userName}</p>
          </div>
          <div className="flex items-center gap-[120px] text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Ghi chú:</p>
            <p>{productStockTakeObject?.note}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">Thông tin sản phẩm xuất</h1>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productStockTakeObject?.stocktakeNoteDetails}
          />
        </div>
      </div>
    </div>
  )
}

export default DetailCheckReport

function ImportExportButton({
  accessoriesLeft,
  children,
  onClick = null,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`text-base text-primary max-w-[120px] px-2 py-3 flex gap-2 items-center ${className}`}
    >
      {accessoriesLeft && <div>{accessoriesLeft}</div>}
      {children}
    </button>
  )
}
function StatusDisplay({ data }) {
  if (data == 2) {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white rounded-2xl bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">Đã hủy</h1>
      </div>
    )
  } else if (data == 1) {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white bg-green-50 border border-green-500 rounded-2xl">
        <h1 className="m-2 ml-3 text-green-500">Hoàn thành</h1>
      </div>
    )
  }
}
