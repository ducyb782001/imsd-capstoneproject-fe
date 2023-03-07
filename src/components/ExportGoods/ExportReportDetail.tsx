import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SecondaryBtn from "../SecondaryBtn"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import {
  exportExportProduct,
  getDetailExportProduct,
} from "../../apis/export-product-module"
import BigNumber from "bignumber.js"
import { format } from "date-fns"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ExportReportDetail() {
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
            <PrimaryInput
              value={data?.amount}
              className="w-16"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Đơn giá",
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <PrimaryInput
                value={data?.price}
                className="w-24"
                readOnly={true}
              />
              <p>đ</p>
            </div>
          ),
        },
        {
          Header: "Chiết khấu",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <PrimaryInput
                value={data?.discount}
                className="w-12"
                readOnly={true}
              />
              <p>%</p>
            </div>
          ),
        },
        {
          Header: "Thành tiền",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <p>
                {new BigNumber(data.amount)
                  .multipliedBy(data.price)
                  .minus(
                    new BigNumber(data.amount)
                      .multipliedBy(data.price)
                      .multipliedBy(data.discount)
                      .dividedBy(100),
                  )
                  .toFormat(0)}
              </p>
            </div>
          ),
        },
      ],
    },
  ]

  const [productImport, setProductImport] = useState<any>()
  const router = useRouter()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  useEffect(() => {
    if (productImport) {
      if (productImport?.state != 1) {
        router.push("/manage-export-goods")
      }
    }
  }, [productImport])
  const { exportId } = router.query
  console.log(productImport)
  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        setProductImport(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!exportId,
    },
  ])

  const handleClickOutBtn = (event) => {
    router.push("/manage-export-goods")
  }

  const exportExportMutation = useMutation(
    async (importProduct) => {
      return await exportExportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Hoàn thành đơn nhập hàng thành công")
          router.push("/export-report-succeed/" + productImport?.exportId)
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
    exportExportMutation.mutate(productImport?.exportId)
  }

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.exportCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                Chờ xuất hàng
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
                Xuẩt hàng
              </ConfirmPopup>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            {productImport && (
              <StepBar
                status="approved"
                createdDate={format(
                  new Date(productImport?.created),
                  "dd/MM/yyyy HH:mm",
                )}
                approvedDate={format(
                  new Date(productImport?.approved),
                  "dd/MM/yyyy HH:mm",
                )}
              />
            )}
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Nhân viên</h1>
            </div>
            <div
              className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform"
              aria-readonly
            >
              {productImport?.user?.userName}
            </div>
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          {productImport && (
            <div className="text-sm font-medium text-center text-gray">
              Ngày tạo đơn:{" "}
              {format(new Date(productImport?.created), "dd/MM/yyyy HH:mm")}
            </div>
          )}
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú hóa đơn"
            value={productImport?.note}
            readOnly={true}
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
            data={productImport?.exportOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">Tổng giá trị đơn hàng:</div>
          {productImport?.totalPrice}
        </div>
      </div>
    </div>
  )
}

export default ExportReportDetail
