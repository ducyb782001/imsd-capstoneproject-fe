import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createExportProduct } from "../../apis/export-product-module"
import {
  getListExportProduct,
  getListExportProductBySupplier,
} from "../../apis/product-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import InfoIcon from "../icons/InfoIcon"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import Tooltip from "../ToolTip"
import AddProductPopup from "../ImportGoods/AddProductPopup"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import SearchProductImportDropdown from "../ImportGoods/SearchProductImportDropdown"
import { useRouter } from "next/router"
import AddChooseSupplierDropdown from "../ManageGoods/AddChooseSupplierDropdown"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function CreateExportReport() {
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
          Header: "Tên sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
          ),
        },
        {
          Header: "SL nhập",
          accessor: (data: any) => (
            <ListQuantitiveImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
              autoUpdatePrice={autoUpdatePrice}
              setAutoUpdatePrice={setAutoUpdatePrice}
            />
          ),
        },
        {
          Header: "Đơn vị",
          accessor: (data: any) => (
            <ListUnitImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: "Đơn giá",
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <ListPriceImport
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
              />
              <p>đ</p>
            </div>
          ),
        },
        {
          Header: "Chiết khấu",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <ListDiscountImport
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
                autoUpdatePrice={autoUpdatePrice}
                setAutoUpdatePrice={setAutoUpdatePrice}
              />
              <p>%</p>
            </div>
          ),
        },
        {
          Header: "Thành tiền",
          accessor: (data: any) => (
            <CountTotalPrice
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
              setNewList={setNewList}
            />
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
                // let listProduct = listProductImport?.filter(
                //   (i, ind) => ind !== index,
                // )
                // setListProductImport(listProduct)
              }}
            >
              <XIcons />
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
  const [autoUpdatePrice, setAutoUpdatePrice] = useState(true)
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProductExport, setListProductExport] = useState<any>([])
  const [productExportObject, setProductExportObject] = useState<any>()
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  const [newList, setNewList] = useState<any>([])

  useEffect(() => {
    if (staffSelected) {
      setProductExportObject({
        ...productExportObject,
        userId: staffSelected?.userId,
      })
    }
  }, [staffSelected])
  useEffect(() => {
    if (nhaCungCapSelected) {
      setProductExportObject({
        ...productExportObject,
        supplierId: nhaCungCapSelected?.supplierId,
      })
      setProductExportObject({
        ...productExportObject,
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
    if (listChosenProduct?.length > 0) {
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
          price: costPrice,
          measuredUnitId: listProductImport.find(
            (i) => i.productId == item.productId,
          )?.measuredUnitId
            ? undefined
            : 0,
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (newList) {
      const totalPrice = newList.reduce((total, item) => {
        const price = new BigNumber(item.costPrice || 0)
        return new BigNumber(total).plus(price)
      }, 0)

      setTotalPriceSend(new BigNumber(totalPrice).toFormat(0))
      setProductExportObject({
        ...productExportObject,
        exportOrderDetails: newList,
        totalPrice: totalPrice.toFixed(),
      })
    }
  }, [newList])

  const totalPrice = () => {
    if (listProductImport?.length > 0) {
      const price = listProductImport.reduce(
        (total, currentValue) =>
          new BigNumber(total).plus(currentValue.price || 0),
        0,
      )
      return <div>{price} đ</div>
    } else {
      return <div>0 đ</div>
    }
  }

  const router = useRouter()
  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const staff = await getListStaff()
        setListStaff(staff?.data)
        const supplier = await getListExportSupplier({})
        setListNhaCungCap(supplier?.data?.data)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getListExportProduct()
        setProductExportObject({
          ...productExportObject,
          exportId: 0,
          state: 0,
          exportCode: "string",
        })
        setListProductExport(response?.data)
        return response?.data
      },
    },
  ])
  console.log(productExportObject)

  const createExportMutation = useMutation(
    async (exportProduct) => {
      return await createExportProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm đơn xuất hàng thành công!")
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

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    createExportMutation.mutate(productExportObject)
  }

  return (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-semibold">Tạo hóa đơn xuất hàng</h1>
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[120px] bg-white border-white"
              title="Dữ liệu bạn vừa nhập sẽ không được lưu, bạn muốn thoát không?"
              handleClickSaveBtn={() => {
                router.push("/manage-export-goods")
              }}
            >
              Thoát
            </ConfirmPopup>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar createdDate={format(Date.now(), "dd/MM/yyyy HH:mm")} />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">
                Thông tin nhân viên tạo phiếu xuất kho
              </h1>
            </div>
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={"Chọn nhân viên"}
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
            rows={8}
            className="mt-5"
            title="Ghi chú hóa đơn"
            onChange={(e) => {
              setProductExportObject({
                ...productExportObject,
                note: e.target.value,
              })
            }}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">Thông tin sản phẩm xuất</h1>
        <SearchProductImportDropdown
          listDropdown={listProductExport?.data}
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
          <div className="text-base font-semibold">
            Tổng giá trị đơn hàng: {totalPriceSend} đ
          </div>
        </div>
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title="Bạn có chắc chắn muốn tạo phiếu nhập hàng không?"
          handleClickSaveBtn={handleClickSaveBtn}
        >
          Tạo hóa đơn xuất hàng
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateExportReport

function ListQuantitiveImport({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
  const [quantity, setQuantity] = useState(0)
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

function ListPriceImport({ data, listProductImport, setListProductImport }) {
  const [costPrice, setCostPrice] = useState()

  useEffect(() => {
    if (data) {
      // Bug chua su dung duoc gia co san de tinh toan
      setCostPrice(data?.sellingPrice)
    }
  }, [data])

  useEffect(() => {
    if (costPrice) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, price: costPrice }
        }
        return item
      })
      setListProductImport(newList)
    }
  }, [costPrice])

  return (
    <PrimaryInput
      className="w-[100px]"
      type="number"
      placeholder="---"
      value={costPrice ? costPrice : ""}
      onChange={(e) => {
        e.stopPropagation()
        setCostPrice(e.target.value)
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
  const [discount, setDiscount] = useState()
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
      }}
    />
  )
}

function CountTotalPrice({
  data,
  listProductImport,
  setListProductImport,
  setNewList,
}) {
  const [price, setPrice] = useState<any>()
  const handleSetPrice = () => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const totalPrice = new BigNumber(item.amount).multipliedBy(item.price)
        const discountPrice = new BigNumber(item.amount)
          .multipliedBy(item.price)
          .multipliedBy(item.discount)
          .dividedBy(100)
        if (item.discount) {
          const afterPrice = totalPrice.minus(discountPrice)
          setPrice(afterPrice)
        } else {
          setPrice(totalPrice)
        }
      }
      return item
    })
  }
  useEffect(() => {
    handleSetPrice()
  }, [listProductImport])

  useEffect(() => {
    if (price) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId === data.productId) {
          return { ...item, costPrice: price.toFixed() }
        }
        return item
      })

      setNewList(newList)
    }
  }, [price])

  return (
    <div className="py-2 text-center text-white rounded-md cursor-pointer bg-successBtn">
      {new BigNumber(price).toFormat(0)} đ
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
          return {
            ...item,
            measuredUnitId: unitChosen?.measuredUnitId,
            costPrice: unitChosen?.suggestedPrice,
          }
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
