import React, { useState } from "react"
import { useQueries } from "react-query"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import { getDetailExportProduct } from "../../apis/export-product-module"

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
            <PrimaryInput value={data?.amount} className="w-16" />
          ),
        },
        {
          Header: "Đơn giá",
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <PrimaryInput value={data?.price} className="w-24" />
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
  const [productImport, setProductImport] = useState<any>()

  const router = useRouter()
  const { exportId } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        setProductImport(response?.data)
        return response?.data
      },
    },
  ])

  const handleClickOutBtn = (event) => {
    router.push("/manage-export-goods")
  }
  console.log(productImport)

  return (
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
              succeededDate={
                new Date(productImport?.completed).getDate() +
                "/" +
                (new Date(productImport?.completed).getMonth() + 1) +
                "/" +
                new Date(productImport?.completed).getFullYear()
              }
              status="approved"
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Nhân viên:</h1>
            </div>
            <PrimaryInput value={productImport?.user?.userName} />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày tạo đơn:{" "}
            {new Date(productImport?.created).getDate() +
              "/" +
              (new Date(productImport?.created).getMonth() + 1) +
              "/" +
              new Date(productImport?.created).getFullYear()}
          </div>
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú hóa đơn"
            placeholder={productImport?.note}
            value={productImport?.note}
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
