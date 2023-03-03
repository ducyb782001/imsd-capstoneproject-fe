import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  createImportProduct,
  getDetailImportProduct,
} from "../../apis/import-product-module"
import { getListExportProductBySupplier } from "../../apis/product-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import PrimaryBtn from "../PrimaryBtn"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"

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
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [listNhaCungCap, setListNhaCungCap] = useState<any>()
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProductBySupplierImport, setListProductBySupplierImport] =
    useState<any>([])
  const [productImportObject, setProductImportObject] = useState<any>()
  const [productImport, setProductImport] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  useEffect(() => {
    if (staffSelected) {
      setProductImportObject({
        ...productImportObject,
        userId: staffSelected?.userId,
      })
    }
  }, [staffSelected])
  useEffect(() => {
    if (nhaCungCapSelected) {
      setProductImportObject({
        ...productImportObject,
        supplierId: nhaCungCapSelected?.supplierId,
      })
      setProductImportObject({
        ...productImportObject,
        state: 0,
      })
      setProductImportObject({
        ...productImportObject,
        importId: 0,
      })
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (productImport) {
      if (productImport?.state != 2) {
        router.push("/manage-import-goods")
      }
    }
  }, [productImport])

  useEffect(() => {
    if (productChosen) {
      if (listChosenProduct.includes(productChosen)) {
        return
      }
      setListChosenProduct([...listChosenProduct, productChosen])
    }
  }, [productChosen])

  useEffect(() => {
    if (listChosenProduct.length > 0) {
      const list = listChosenProduct.map((item) => {
        const discount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.discount
        const amount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const costPrice = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.costPrice
        const price = 0
        if (discount != undefined) {
          const price = listProductImport.find(
            (i) => i.productId == item.productId,
          )?.price
        }
        return {
          productId: item.productId,
          amount: amount,
          costPrice: costPrice,
          discount: discount,
          price: price,
          measuredUnitId: listProductImport.find(
            (i) => i.productId == item.productId,
          )?.measuredUnitId,
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      setProductImportObject({
        ...productImportObject,
        importDetailDTOs: listProductImport,
      })
    }
  }, [listProductImport])

  const totalPrice = () => {
    if (listProductImport?.length > 0) {
      const price = listProductImport.reduce(
        (total, currentValue) =>
          new BigNumber(total).plus(currentValue.price || 0),
        0,
      )
      return <div>{price.toFormat()} đ</div>
    } else {
      return <div>0 đ</div>
    }
  }

  const createImportMutation = useMutation(
    async (importProduct) => {
      return await createImportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Thêm đơn nhập hàng thành công")
          router.push("/manage-import-goods")
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

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()
    createImportMutation.mutate(productImportObject)
  }

  const router = useRouter()
  const { importId } = router.query

  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const staff = await getListStaff()
        setListStaff(staff?.data?.data)
        const supplier = await getListExportSupplier({})
        setListNhaCungCap(supplier?.data?.data)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getDetailProductImport", importId],
      queryFn: async () => {
        const detail = await getDetailImportProduct(router.query.importId)
        setProductImport(detail?.data)
        setIsLoadingReport(detail?.data?.isLoading)
        return detail?.data
      },
      enabled: !!importId,
    },
    {
      queryKey: ["getListProductBySupplier", nhaCungCapSelected],
      queryFn: async () => {
        if (nhaCungCapSelected) {
          const response = await getListExportProductBySupplier(
            nhaCungCapSelected.supplierId,
          )
          setProductImportObject({
            ...productImportObject,
            supplierId: nhaCungCapSelected.supplierId,
          })

          setListProductBySupplierImport(response?.data)

          return response?.data
        } else {
          const response = await getListExportProductBySupplier(
            nhaCungCapSelected.supplierId,
          )
          setProductImportObject({
            ...productImportObject,
            supplierId: nhaCungCapSelected.supplierId,
          })

          setListProductBySupplierImport(response?.data)

          return response?.data
        }
      },
    },
  ])
  console.log(productImport)

  const handleClickOutBtn = (event) => {
    router.push("/manage-import-goods")
  }

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid gap-5 grid-cols md:grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImport?.importCode}
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
                new Date(productImport?.created),
                "dd/MM/yyyy HH:mm",
              )}
              approvedDate={format(
                new Date(productImport?.approved),
                "dd/MM/yyyy HH:mm",
              )}
              succeededDate={format(
                new Date(productImport?.completed),
                "dd/MM/yyyy HH:mm",
              )}
              status="succeed"
            />
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
              (new Date(productImport?.created).getMonth() + 1) +
              "/" +
              new Date(productImport?.created).getFullYear()}
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

export default ImportReportSucceed
