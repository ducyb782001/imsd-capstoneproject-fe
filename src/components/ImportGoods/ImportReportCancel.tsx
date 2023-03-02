import React, { useState } from "react"
import { useQueries } from "react-query"
import { getDetailImportProduct } from "../../apis/import-product-module"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import { BigNumber } from "bignumber.js"

function ImportReportCanceled() {
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
        {
          Header: "Thành tiền",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <p>
                {new BigNumber(data.amount)
                  .multipliedBy(data.costPrice)
                  .minus(
                    new BigNumber(data.amount)
                      .multipliedBy(data.costPrice)
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
  const { importId } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductImport", importId],
      queryFn: async () => {
        const response = await getDetailImportProduct(importId)
        setProductImport(response?.data)
        return response?.data
      },
    },
  ])

  const handleClickOutBtn = (event) => {
    router.push("/manage-import-goods")
  }

  return (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.importCode}
              </h1>
              <div className="px-4 py-1 font-bold text-red-600 bg-red-100 border border-red-600 rounded-2xl">
                Đã hủy
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <PrimaryBtn onClick={handleClickOutBtn} className="w-[120px]">
                Thoát
              </PrimaryBtn>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar status="new" />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Nhà cung cấp:</h1>
            </div>
            <PrimaryInput value={productImport?.supplier?.supplierName} />
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
              new Date(productImport?.created).getMonth() +
              "/" +
              new Date(productImport?.created).getFullYear()}
          </div>
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <PrimaryInput value={productImport?.user?.email} readOnly={true} />
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
            placeholder={productImport?.note}
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
            data={productImport?.importOrderDetails}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">Tổng giá trị đơn hàng:</div>
          {new BigNumber(productImport?.totalCost || 0).toFormat()}
        </div>
      </div>
    </div>
  )
}

export default ImportReportCanceled
