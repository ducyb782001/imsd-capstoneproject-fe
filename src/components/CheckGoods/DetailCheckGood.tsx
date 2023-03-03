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

function DetailCheckReport() {
  const data_fake = [
    {
      productCode: "AHC123",
      productName: "Bánh mì tươi",
      measuredUnitId: "Thùng",
      typeGood: "Bánh mì",
      stock: 12,
      realStock: 10,
      deviated: 2,
      note: "Hỏng do thời tiết",
    },
    {
      productCode: "AHC123",
      productName: "Bánh mì tươi",
      measuredUnitId: "Thùng",
      typeGood: "Bánh mì",
      stock: 12,
      realStock: 10,
      deviated: 2,
      note: "Hỏng do thời tiết",
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
          Header: "Ảnh",
          accessor: (data: any) => (
            <img
              src={data?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: "Mã sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productCode}</p>
          ),
        },
        {
          Header: "Tên sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
          ),
        },
        {
          Header: "Đơn vị",
          accessor: (data: any) => (
            <PrimaryInput
              value={data?.measuredUnitId}
              className="w-20"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Loại",
          accessor: (data: any) => (
            <PrimaryInput
              value={data?.typeGood}
              className="w-16"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Tồn chi nhánh",
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <PrimaryInput
                value={data?.stock}
                className="w-16"
                readOnly={true}
              />
            </div>
          ),
        },
        {
          Header: "Tồn thực tế",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <PrimaryInput
                value={data?.realStock}
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
              value={data?.deviated}
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

  const [productExportObject, setProductExportObject] = useState<any>()

  const router = useRouter()
  const { checkId } = router.query

  // useQueries([
  //   {
  //     queryKey: ["getListStaff"],
  //     queryFn: async () => {
  //       const staff = await getListStaff()
  //       setListStaff(staff?.data)
  //       const supplier = await getListExportSupplier({})
  //       setListNhaCungCap(supplier?.data?.data)
  //       return staff?.data?.data
  //     },
  //   },

  //   {
  //     queryKey: ["getListProduct"],
  //     queryFn: async () => {
  //       const response = await getListExportProduct()
  //       setProductExportObject({
  //         ...productExportObject,
  //         exportId: 0,
  //         state: 0,
  //         exportCode: "string",
  //       })
  //       setListProductExport(response?.data)
  //       return response?.data
  //     },
  //   },
  // ])

  const handleClickOutBtn = (event) => {
    router.push("/manage-check-good")
  }
  const handleExportCheckProduct = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(
      productExportObject?.listProductImport,
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
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
              <StatusDisplay data={checkId} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                Thoát
              </PrimaryBtn>
            </div>
          </div>

          <div className="flex items-center gap-12 text-sm font-normal text-left text-gray mb-3">
            <p className="font-bold">Mã đơn kiểm hàng:</p>
            <p>KIHA123</p>
          </div>
          <div className="flex items-center gap-20 text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Ngày tạo đơn:</p>
            <p>12/08/2022 15:30</p>
          </div>
          <div className="flex items-center gap-12 text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Nhân viên tạo đơn:</p>
            <p>Thủ kho Lâm</p>
          </div>
          <div className="flex items-center gap-[72px] text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Ngày cân bằng:</p>
            <p>12/08/2022 15:30</p>
          </div>
          <div className="flex items-center gap-10 text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Nhân viên cân bằng:</p>
            <p>Thủ kho Lâm</p>
          </div>
          <div className="flex items-center gap-[120px] text-sm font-medium text-left text-gray mb-3">
            <p className="font-bold">Ghi chú:</p>
            <p>Kiểm tra hàng tháng 8</p>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">Thông tin sản phẩm xuất</h1>
        <div className="flex gap-2">
          <ImportExportButton
            onClick={handleExportCheckProduct}
            accessoriesLeft={<DownloadIcon />}
          >
            Xuất file
          </ImportExportButton>
          <ImportExportButton accessoriesLeft={<UploadIcon />}>
            Nhập file
          </ImportExportButton>
        </div>
        <div className="mt-4 table-style">
          <Table pageSizePagination={10} columns={columns} data={data_fake} />
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
