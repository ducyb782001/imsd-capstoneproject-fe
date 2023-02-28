import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  approveImportProduct,
  createImportProduct,
  denyImportProduct,
  getDetailImportProduct,
  updateImportProduct,
} from "../../apis/import-product-module"
import { getListExportProductBySupplier } from "../../apis/product-module"
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
import AddProductPopup from "./AddProductPopup"
import ChooseStaffDropdown from "./ChooseStaffDropdown"
import ChooseUnitImport from "./ChooseUnitImport"
import SearchProductImportDropdown from "./SearchProductImportDropdown"
import { useRouter } from "next/router"
import AddChooseSupplierDropdown from "../ManageGoods/AddChooseSupplierDropdown"

function CreateImportReport() {
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
              data={data?.product}
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
                autoUpdatePrice={autoUpdatePrice}
                setAutoUpdatePrice={setAutoUpdatePrice}
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
              autoUpdatePrice={autoUpdatePrice}
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
  const [listNhaCungCap, setListNhaCungCap] = useState<any>()
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
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      setProductImportObject({
        ...productImportObject,
        importOrderDetails: listProductImport,
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
      return await approveImportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Duyệt đơn nhập hàng thành công")
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
  const updateImportMutation = useMutation(
    async (importProduct) => {
      return await updateImportProduct(importProduct)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Cập nhật đơn nhập hàng thành công")
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
  const router = useRouter()
  const { importId } = router.query

  const handleClickApproveBtn = async (event) => {
    event?.preventDefault()
    await updateImportMutation.mutate(productImportObject)
    console.log("Test")
    await approveImportMutation.mutate(productImportObject?.importId)
  }

  const cancelImportMutation = useMutation(
    async (importProduct) => {
      return await denyImportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Hủy đơn nhập hàng thành công")
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
  const handleClickCancelBtn = (event) => {
    event?.preventDefault()
    cancelImportMutation.mutate(productImportObject?.importId)
  }

  useQueries([
    {
      queryKey: ["getDetailProductImport", importId],
      queryFn: async () => {
        const response = await getDetailImportProduct(importId)
        setListChosenProduct(response?.data?.importOrderDetails)
        setProductImportObject(response?.data)
        return response?.data
      },
    },
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
      queryKey: ["getListProductBySupplier", nhaCungCapSelected],
      queryFn: async () => {
        if (nhaCungCapSelected) {
          const response = await getListExportProductBySupplier(
            nhaCungCapSelected.supplierId,
          )
          setProductImportObject({
            ...productImportObject,
            supplierId: nhaCungCapSelected.supplierId,
            state: 0,
          })
          setListProductBySupplierImport(response?.data)

          return response?.data
        }
      },
    },
  ])
  console.log(listChosenProduct)

  return (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImportObject?.importCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                Chờ duyệt đơn
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title="Dữ liệu bạn vừa nhập sẽ không được lưu, bạn muốn thoát không?"
                handleClickSaveBtn={() => {
                  router.push("/manage-import-goods")
                }}
              >
                Thoát
              </ConfirmPopup>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title="Bạn chắc chắn muốn hủy đơn?"
                handleClickSaveBtn={handleClickCancelBtn}
              >
                Hủy đơn
              </ConfirmPopup>
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
              <h1 className="text-xl font-semibold">Chọn nhà cung cấp</h1>
              <Tooltip content="Chọn nhà cung cấp để hiển thị mặt hàng tương ứng">
                <InfoIcon />
              </Tooltip>
            </div>
            <AddChooseSupplierDropdown
              listDropdown={listNhaCungCap}
              textDefault={productImportObject?.supplier?.supplierName}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
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
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <ChooseStaffDropdown
            listDropdown={listStaff}
            textDefault={productImportObject?.user?.userName}
            showing={staffSelected}
            setShowing={setStaffSelected}
          />
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
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
        <SearchProductImportDropdown
          listDropdown={listProductBySupplierImport?.data}
          textDefault={"Nhà cung cấp"}
          showing={productChosen}
          setShowing={setProductChosen}
        />
        <AddProductPopup className="mt-4" />
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

export default CreateImportReport

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
  const [costPrice, setCostPrice] = useState(data?.costPrice)

  useEffect(() => {
    if (data) {
      // Bug chua su dung duoc gia co san de tinh toan
      setCostPrice(data?.costPrice)
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
