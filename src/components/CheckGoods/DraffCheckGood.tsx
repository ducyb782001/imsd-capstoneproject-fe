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

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function DraffCheckReport() {
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

  const [productStockTakeObject, setProductStockTakeObject] = useState<any>()

  const router = useRouter()
  const { checkId } = router.query

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
  console.log(productStockTakeObject)

  const approveExportMutation = useMutation(
    async (exportProduct) => {
      return await approveStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Duyệt đơn kiểm hàng thành công!")
          router.push("/manage-check-good")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
            )
          }
        }
      },
    },
  )

  const denyExportMutation = useMutation(
    async (exportProduct) => {
      return await denyStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Hủy đơn kiểm hàng thành công!")
          router.push("/manage-check-good")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
            )
          }
        }
      },
    },
  )

  const handleClickApproveBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    approveExportMutation.mutate(productStockTakeObject?.stocktakeId)
  }

  const handleClickCancelBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    denyExportMutation.mutate(productStockTakeObject?.stocktakeId)
  }
  const handleClickOutBtn = (event) => {
    router.push("/manage-check-good")
  }
  const handleExportCheckProduct = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(
      productStockTakeObject?.listProductImport,
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Chỉnh sửa kiểm hàng</h1>
          </div>
          <div className="flex items-center justify-between gap-4">
            <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
              Thoát
            </SecondaryBtn>
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[60px] !bg-transparent text-cancelBtn !border-cancelBtn hover:!bg-[#ED5B5530]"
              title="Bạn chắc chắn muốn hủy đơn kiểm hàng này?"
              handleClickSaveBtn={handleClickCancelBtn}
            >
              Hủy
            </ConfirmPopup>
            <SecondaryBtn
              className="w-[100px] !border-blue hover:bg-[#3388F730] text-blue active:bg-blueDark active:border-blueDark "
              onClick={() => {
                router.push(
                  "/edit-check-good/" + productStockTakeObject?.stocktakeId,
                )
              }}
            >
              Sửa đơn
            </SecondaryBtn>
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[120px]"
              title="Bạn chắc chắn muốn duyệt đơn kiểm hàng?"
              handleClickSaveBtn={handleClickApproveBtn}
            >
              Duyệt đơn
            </ConfirmPopup>
          </div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-semibold">Thông tin đơn</h1>
          </div>
          <div className="mb-2 text-sm font-bold text-gray">
            Ngày kiểm hàng: {format(Date.now(), "dd/MM/yyyy")}
          </div>
          <div className="w-64">
            <div className="mb-2 text-sm font-bold text-gray">Nhân viên</div>
            <div
              className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform"
              aria-readonly
            >
              {productStockTakeObject?.createdBy?.userName}
            </div>
          </div>

          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú hóa đơn"
            value={productStockTakeObject?.note}
            readOnly={true}
          />
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

export default DraffCheckReport

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
