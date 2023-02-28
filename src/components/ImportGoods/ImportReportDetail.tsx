import BigNumber from "bignumber.js"
import { format, parseISO } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  getDetailImportProduct,
  importImportProduct,
} from "../../apis/import-product-module"
import { getListExportProductBySupplier } from "../../apis/product-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SecondaryBtn from "../SecondaryBtn"
import StepBar from "../StepBar"
import Table from "../Table"
import AddProductPopup from "./AddProductPopup"
import ChooseUnitImport from "./ChooseUnitImport"
import SearchProductImportDropdown from "./SearchProductImportDropdown"
import { useRouter } from "next/router"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"

function ImportReportDetail() {
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
              {data?.product?.productName}
            </p>
          ),
        },
        {
          Header: "SL nhập",
          accessor: (data: any) => (
            <PrimaryInput value={data?.amount} className="w-16" />
          ),
        },
        {
          Header: "Đơn giá",
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <PrimaryInput value={data?.costPrice} className="w-24" />
              <p>đ</p>
            </div>
          ),
        },
        {
          Header: "Chiết khấu",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <PrimaryInput value={data?.discount} className="w-12" />
              <p>%</p>
            </div>
          ),
        },
      ],
    },
  ]
  const [productImportObject, setProductImportObject] = useState<any>()
  const [productImport, setProductImport] = useState<any>()
  const router = useRouter()
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

  useEffect(() => {
    if (productImport) {
      if (productImport?.state != 1) {
        router.push("/manage-import-goods")
      }
    }
  }, [productImport])
  const { importId } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductImport", importId],
      queryFn: async () => {
        const response = await getDetailImportProduct(importId)
        setProductImport(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
    },
  ])

  const importImportMutation = useMutation(
    async (importProduct) => {
      return await importImportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Nhập hàng đơn nhập hàng thành công")
          router.push("/import-report-succeed/" + productImport?.importId)
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
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
    importImportMutation.mutate(productImport?.importId)
  }
  const handleClickOutBtn = (event) => {
    router.push("/manage-import-goods")
  }

  const now = new Date()
  console.log(productImport)

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.importCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                Chờ nhận hàng
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
                Thoát
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title="Bạn chắc chắn muốn duyệt đơn?"
                handleClickSaveBtn={handleClickApproveBtn}
              >
                Nhận hàng
              </ConfirmPopup>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar
              status="pending"
              createdDate={
                new Date(productImport?.created).getDate() +
                "/" +
                (new Date(productImport?.created).getMonth() + 1) +
                "/" +
                new Date(productImport?.created).getFullYear()
              }
              approvedDate={
                new Date(productImport?.approved).getDate() +
                "/" +
                (new Date(productImport?.approved).getMonth() + 1) +
                "/" +
                new Date(productImport?.approved).getFullYear()
              }
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Nhà cung cấp</h1>
            </div>
            <div className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
              {productImport?.supplier?.supplierName}
            </div>
            {/* <ChooseSupplierDropdown
              listDropdown={listSupplier?.data}
              textDefault={"Nhà cung cấp"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            /> */}
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày tạo đơn:{" "}
            {new Date(productImport?.approved).getDate() +
              "/" +
              (new Date(productImport?.approved).getMonth() + 1) +
              "/" +
              new Date(productImport?.approved).getFullYear()}
          </div>
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <div className="flex items-center justify-between gap-1 px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
            <div className="flex items-center gap-1">
              <p className="text-gray">{productImport?.user?.userName}</p>
            </div>
          </div>
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
            value={productImport?.note}
            onChange={(e) => {
              setProductImportObject({
                ...productImportObject,
                note: e.target.value,
              })
            }}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          Thông tin sản phẩm nhập vào
        </h1>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productImport?.importOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">Tổng giá trị đơn hàng:</div>
          {productImport?.totalCost}
        </div>
      </div>
    </div>
  )
}

export default ImportReportDetail
