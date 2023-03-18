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

function ImportReportSucceed() {
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
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const router = useRouter()
  const { exportId } = router.query

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

  return isLoadingReport ? (
    <ExportReportSkeleton />
  ) : (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.exportCode}
              </h1>
              <div className="px-4 py-1 bg-green-100 border border-[#3DBB65] text-[#3DBB65] font-bold rounded-2xl">
                Hoàn thành
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                Thoát
              </PrimaryBtn>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar
              createdDate={format(
                parseISO(
                  productImport?.created
                    ? productImport?.created
                    : new Date().toISOString(),
                ),
                "dd/MM/yyyy HH:mm",
              )}
              // approvedDate={format(
              //   new Date(
              //     productImport?.approved
              //       ? productImport?.approved
              //       : new Date().toISOString,
              //   ),
              //   "dd/MM/yyyy HH:mm",
              // )}
              // succeededDate={format(
              //   new Date(
              //     productImport?.completed
              //       ? productImport?.completed
              //       : new Date().toISOString,
              //   ),
              //   "dd/MM/yyyy HH:mm",
              // )}
              status="succeed"
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Nhân viên:</h1>
            </div>
            <PrimaryInput
              value={productImport?.user?.userName}
              readOnly={true}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày tạo đơn:{" "}
            {format(
              parseISO(
                productImport?.created
                  ? productImport?.created
                  : new Date().toISOString(),
              ),
              "dd/MM/yyyy HH:mm",
            )}
          </div>
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú hóa đơn"
            placeholder={productImport?.note}
            value={productImport?.note}
            readOnly={true}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          Thông tin sản phẩm xuất đi
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

export default ImportReportSucceed
