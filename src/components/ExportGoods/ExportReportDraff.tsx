import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import SearchProductImportDropdown from "../ImportGoods/SearchProductImportDropdown"
import { useRouter } from "next/router"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import {
  approveExportProduct,
  denyExportProduct,
  getDetailExportProduct,
  updateExportProduct,
} from "../../apis/export-product-module"
import SecondaryBtn from "../SecondaryBtn"
import ExportReportSkeleton from "../Skeleton/ExportReportSkeleton"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ExportReportDraff() {
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
                value={data?.costPrice}
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
        {
          Header: " ",
          accessor: (data: any, index) => (
            <div
              className="cursor-pointer"
              onClick={() => {
                let result = listChosenProduct?.filter(
                  (i, ind) => ind !== index,
                )
                setListChosenProduct(result)
              }}
            >
              <XIcons />
            </div>
          ),
        },
      ],
    },
  ]

  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [autoUpdatePrice, setAutoUpdatePrice] = useState(true)
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProductBySupplierImport, setListProductBySupplierImport] =
    useState<any>([])
  const [productImportObject, setProductImportObject] = useState<any>()
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
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
    setNhaCungCapSelected(productImportObject?.supplier)
  }, [productImportObject])

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
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (productChosen) {
      if (listChosenProduct.includes(productChosen)) {
        return
      }
      setListChosenProduct([...listChosenProduct, productChosen])
    }
  }, [productChosen])

  useEffect(() => {
    if (listChosenProduct) {
      const list = listChosenProduct.map((item) => {
        const discount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.discount
          ? undefined
          : 0
        const amount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const costPrice = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.costPrice
        const price = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.price

        return {
          productId: item.productId,
          amount: amount,
          costPrice: costPrice,
          discount: discount,
          price: price,
          measuredUnitId: listProductImport.find(
            (i) => i.productId == item.productId,
          )?.measuredUnitId
            ? undefined
            : 0,
          exportId: productImportObject?.exportId,
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      setProductImportObject({
        ...productImportObject,
        exportOrderDetails: listProductImport,
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

  const approveImportMutation = useMutation(
    async (importProduct) => {
      return await approveExportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Duyệt đơn xuất hàng thành công")
          router.push("/export-report-detail/" + productImportObject?.exportId)
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
  const updateExportMutation = useMutation(async (importProduct) => {
    return await updateExportProduct(importProduct)
  })
  const router = useRouter()
  const { exportId } = router.query

  const handleClickApproveBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // updateExportMutation.mutate(productImportObject)

    approveImportMutation.mutate(productImportObject?.exportId)
  }

  const cancelImportMutation = useMutation(
    async (importProduct) => {
      return await denyExportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Hủy đơn nhập hàng thành công")
          router.push("/manage-export-goods")
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
  const handleClickCancelBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    cancelImportMutation.mutate(productImportObject?.exportId)
  }

  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        setListChosenProduct(response?.data?.exportOrderDetails)
        setListProductImport(response?.data?.exportOrderDetails)
        setProductImportObject(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const staff = await getListStaff()
        setListStaff(staff?.data)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const staff = await getListStaff()
        setListStaff(staff?.data)
        return staff?.data?.data
      },
    },
  ])
  const handleClickOutBtn = (event) => {
    router.push("/manage-export-goods")
  }

  console.log(listChosenProduct)

  return isLoadingReport ? (
    <ExportReportSkeleton />
  ) : (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImportObject?.exportCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                Chờ duyệt đơn
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
                Thoát
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[60px] !bg-transparent text-cancelBtn !border-cancelBtn hover:!bg-[#ED5B5530]"
                title="Bạn chắc chắn muốn hủy đơn hàng này?"
                handleClickSaveBtn={handleClickCancelBtn}
              >
                Hủy
              </ConfirmPopup>
              <SecondaryBtn
                className="w-[100px] !border-blue hover:bg-[#3388F730] text-blue active:bg-blueDark active:border-blueDark "
                onClick={() => {
                  router.push(
                    "/export-report-edit/" + productImportObject?.exportId,
                  )
                }}
              >
                Sửa đơn
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title="Bạn chắc chắn muốn duyệt đơn?"
                handleClickSaveBtn={handleClickApproveBtn}
              >
                Duyệt đơn
              </ConfirmPopup>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar createdDate={format(Date.now(), "dd/MM/yyyy HH:mm")} />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Chọn nhân viên</h1>
            </div>
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={productImportObject?.user?.userName}
              showing={staffSelected}
              setShowing={setStaffSelected}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày tạo đơn: {format(Date.now(), "dd/MM/yyyy")}
          </div>
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú hóa đơn"
            value={productImportObject?.note}
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
          Thông tin sản phẩm xuất đi
        </h1>
        <SearchProductImportDropdown
          listDropdown={listProductBySupplierImport?.data}
          textDefault={"Nhà cung cấp"}
          showing={productChosen}
          setShowing={setProductChosen}
        />
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={listChosenProduct}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">Tổng giá trị đơn hàng:</div>
          {totalPrice()}
        </div>
      </div>
    </div>
  )
}

export default ExportReportDraff

function ListQuantitiveImport({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
  const [quantity, setQuantity] = useState(data?.amount)
  const handleOnChangeAmount = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, amount: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[60px]"
      type="number"
      placeholder="0"
      value={quantity ? quantity : ""}
      onChange={(e) => {
        e.stopPropagation()
        setQuantity(e.target.value)
        handleOnChangeAmount(e.target.value, data)
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function ListPriceImport({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
  const [costPrice, setCostPrice] = useState(data?.price)

  useEffect(() => {
    if (data) {
      // Bug chua su dung duoc gia co san de tinh toan
      setCostPrice(data?.price)
    }
  }, [data])

  const handleOnChangePrice = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, costPrice: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[100px]"
      type="number"
      placeholder="---"
      value={costPrice ? costPrice : ""}
      onChange={(e) => {
        e.stopPropagation()
        setCostPrice(e.target.value)
        handleOnChangePrice(e.target.value, data)
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function ListDiscountImport({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
  const [discount, setDiscount] = useState(data?.discount)
  const handleOnChangeDiscount = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, discount: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[50px]"
      type="number"
      placeholder="0"
      value={discount ? discount : ""}
      onChange={(e) => {
        e.stopPropagation()
        setDiscount(e.target.value)
        handleOnChangeDiscount(e.target.value, data)
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function CountTotalPrice({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
}) {
  const [price, setPrice] = useState<any>()
  const handleSetPrice = () => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const totalPrice = new BigNumber(item.amount).multipliedBy(
          item.costPrice,
        )
        const discountPrice = new BigNumber(item.amount)
          .multipliedBy(item.costPrice)
          .multipliedBy(item.discount)
          .dividedBy(100)
        if (item.discount) {
          const afterPrice = totalPrice.minus(discountPrice)
          setPrice(afterPrice.toFormat(0))
          return { ...item, price: afterPrice.toFixed() }
        } else {
          setPrice(totalPrice.toFormat(0))
          return { ...item, price: totalPrice.toFixed() }
        }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <div
      className="py-2 text-center text-white rounded-md cursor-pointer bg-successBtn"
      onClick={handleSetPrice}
    >
      {price} đ
    </div>
  )
}

function ListUnitImport({ data, listProductImport, setListProductImport }) {
  const [listDropdown, setListDropdown] = useState([])
  const [unitChosen, setUnitChosen] = useState<any>()
  const [defaultMeasuredUnit, setDefaultMeasuredUnit] = useState("")

  useEffect(() => {
    if (data) {
      setListDropdown(data?.measuredUnits)
      setDefaultMeasuredUnit(data?.defaultMeasuredUnit)
    }
  }, [data])

  useEffect(() => {
    if (unitChosen) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, measuredUnitId: unitChosen?.measuredUnitId }
        }
        return item
      })
      setListProductImport(newList)
    }
  }, [unitChosen])

  return (
    <ChooseUnitImport
      listDropdown={listDropdown}
      showing={unitChosen}
      setShowing={setUnitChosen}
      textDefault={defaultMeasuredUnit}
    />
  )
}
