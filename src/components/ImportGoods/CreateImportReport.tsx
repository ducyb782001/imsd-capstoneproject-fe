import BigNumber from "bignumber.js"
import { format, parseISO } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createImportProduct } from "../../apis/import-product-module"
import { getListExportProductBySupplier } from "../../apis/product-module"
import {
  getListExportSupplier,
  getListSupplier,
} from "../../apis/supplier-module"
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
import { useTranslation } from "react-i18next"
import { countUndefinedOrEmptyAmount } from "../../hooks/useCountUndefinedAmount"
import SecondaryBtn from "../SecondaryBtn"
import DeleteDetail from "../DeleteDetail"
import ImportGoodIcon from "../icons/ImportGoodIcon"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"
function CreateImportReport() {
  const { t } = useTranslation()

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
            <div className="flex items-center justify-center gap-1">
              <ListDiscountImport
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
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
            />
          ),
        },
        {
          Header: " ",
          accessor: (data: any, index) => (
            <div
              className="w-full cursor-pointer"
              onClick={() => {
                let result = listChosenProduct?.filter(
                  (i) => i?.productId !== data?.productId,
                )
                setListChosenProduct(result)
              }}
            >
              <DeleteDetail />
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
  const [totalPriceSend, setTotalPriceSend] = useState<any>()

  const [isLoadingSupplier, setIsloadingSupplier] = useState(true)

  const [userData, setUserData] = useState<any>()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData != "undefined") {
        setUserData(JSON.parse(userData))
      }
    }
  }, [])

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

        return {
          productId: item.productId,
          amount: amount,
          costPrice: costPrice,
          discount: discount,
          measuredUnitId: listProductImport.find(
            (i) => i.productId == item.productId,
          )?.measuredUnitId,
        }
      })
      setListProductImport(list)
    } else {
      setTotalPriceSend(0)
    }
    setProductChosen(null)
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      const price = listProductImport.reduce((accumulator, currentProduct) => {
        const cost = new BigNumber(currentProduct.costPrice || 0).times(
          currentProduct.amount || 0,
        )
        if (currentProduct.discount) {
          const discountPrice = new BigNumber(currentProduct.amount || 0)
            .multipliedBy(currentProduct.costPrice || 0)
            .multipliedBy(currentProduct.discount || 0)
            .dividedBy(100)
          return accumulator.plus(cost).minus(discountPrice)
        } else {
          return accumulator.plus(cost)
        }
      }, new BigNumber(0))
      setTotalPriceSend(price)
      setProductImportObject({
        ...productImportObject,
        importOrderDetails: listProductImport,
        totalCost: new BigNumber(price).toFixed(),
      })
    }
  }, [listProductImport])

  const createImportMutation = useMutation(
    async (importProduct) => {
      return await createImportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm đơn nhập hàng thành công")
          router.push("/manage-import-orders")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data || t("error_occur"))
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

    const count = countUndefinedOrEmptyAmount(listProductImport)

    if (count > 0) {
      toast.error(
        "Sản phẩm có số lượng xuất là 0. Vui lòng xóa sản phẩm đó để tiếp tục",
      )
      return
    }

    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })

    const submittedData = {
      ...productImportObject,
    }
    if (!staffSelected) {
      submittedData["userId"] = userData.userId
    }

    createImportMutation.mutate(submittedData)
  }

  const router = useRouter()

  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        setIsloadingSupplier(true)
        const staff = await getListStaff()
        setListStaff(staff?.data?.data)

        const response = await getListSupplier({
          offset: 0,
          limit: 1000,
          status: true,
        })

        setListNhaCungCap(response?.data?.data)
        setIsloadingSupplier(false)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProductBySupplier", nhaCungCapSelected],
      queryFn: async () => {
        if (nhaCungCapSelected) {
          const response = await getListExportProductBySupplier({
            offSet: 0,
            limit: 1000,
            supId: nhaCungCapSelected.supplierId,
            status: true,
          })
          setProductImportObject({
            ...productImportObject,
            supplierId: nhaCungCapSelected.supplierId,
            importId: 0,
            state: 0,
          })
          setListProductBySupplierImport(response?.data)

          return response?.data
        }
      },
    },
  ])

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <h1 className="text-2xl font-semibold">Tạo hóa đơn nhập hàng</h1>
          <div className="flex justify-center mt-6">
            <StepBar
              createdDate={format(
                parseISO(new Date().toISOString()),
                "dd/MM/yyyy HH:mm",
              )}
            />
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
              textDefault={"Nhà cung cấp"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
              isLoadingSupplier={isLoadingSupplier}
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
            textDefault={userData?.userName || "Chọn nhân viên"}
            showing={staffSelected}
            setShowing={setStaffSelected}
            isLoadingStaff={isLoadingSupplier}
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
        <div className="flex items-center gap-3 mb-4">
          <ImportGoodIcon />
          <h1 className="text-xl font-semibold">Thông tin sản phẩm nhập vào</h1>
        </div>
        <SearchProductImportDropdown
          listDropdown={listProductBySupplierImport?.data}
          placeholder={t("search.searchInGoods")}
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
          <div className="text-base font-semibold">
            Tổng giá trị đơn hàng: {new BigNumber(totalPriceSend).toFormat(0)} đ
          </div>
        </div>
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title="Bạn có chắc chắn muốn tạo phiếu nhập hàng không?"
          handleClickSaveBtn={handleClickSaveBtn}
          disabled={submitted || listChosenProduct?.length === 0}
        >
          Tạo hóa đơn nhập hàng
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateImportReport

function ListQuantitiveImport({
  data,
  listProductImport,
  setListProductImport,
}) {
  const [quantity, setQuantity] = useState()
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

  const renderWarningImport = () => {
    const product = listProductImport?.filter(
      (i) => i.productId === data?.productId,
    )
    if (!product[0]?.measuredUnitId) {
      const overAmount = new BigNumber(quantity)
        .plus(data?.inStock ? data?.inStock : 0)
        .isGreaterThan(data?.maxStock)
      return (
        overAmount && (
          <p className="absolute text-xs text-dangerous">
            Số lượng nhập vượt định mức
          </p>
        )
      )
    } else {
      const quantityUnit = data?.measuredUnits.filter(
        (i) => i.measuredUnitId === product[0]?.measuredUnitId,
      )[0].measuredUnitValue

      const overAmount = new BigNumber(quantity)
        .multipliedBy(quantityUnit)
        .plus(data?.inStock ? data?.inStock : 0)
        .isGreaterThan(data?.maxStock)

      return (
        overAmount && (
          <p className="absolute text-xs text-dangerous">
            Số lượng nhập vượt định mức
          </p>
        )
      )
    }
  }

  return (
    <div className="relative">
      <PrimaryInput
        className="w-[60px]"
        type="number"
        min="0"
        placeholder="0"
        value={BigNumber(quantity).isGreaterThanOrEqualTo(0) ? quantity : ""}
        onChange={(e) => {
          e.stopPropagation()
          const value = e.target.value < 0 ? 0 : e.target.value
          setQuantity(value)
          handleOnChangeAmount(value, data)
        }}
      />
      {renderWarningImport()}
    </div>
  )
}

function ListPriceImport({ data, listProductImport, setListProductImport }) {
  const [costPrice, setCostPrice] = useState()

  useEffect(() => {
    if (data) {
      setCostPrice(data?.costPrice)
    }
  }, [data])

  useEffect(() => {
    if (costPrice) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, costPrice: costPrice }
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
      min="0"
      placeholder="---"
      value={BigNumber(costPrice).isGreaterThanOrEqualTo(0) ? costPrice : ""}
      onChange={(e) => {
        e.stopPropagation()
        const value = e.target.value < 0 ? 0 : e.target.value
        setCostPrice(value)
      }}
    />
  )
}

function ListDiscountImport({ data, listProductImport, setListProductImport }) {
  const [discount, setDiscount] = useState()

  const handleOnChangeAmount = (value, data) => {
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
      className="w-[60px]"
      type="number"
      min="0"
      placeholder="0"
      value={BigNumber(discount).isGreaterThanOrEqualTo(0) ? discount : ""}
      onChange={(e) => {
        e.stopPropagation()
        const value =
          e.target.value < 0 || e.target.value > 100 ? 0 : e.target.value
        setDiscount(value)
        handleOnChangeAmount(value, data)
      }}
    />
  )
}

function CountTotalPrice({ data, listProductImport }) {
  const [price, setPrice] = useState<any>()
  const handleSetPrice = () => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const totalPrice = new BigNumber(item.amount || 0).multipliedBy(
          item.costPrice || 0,
        )
        const discountPrice = new BigNumber(item.amount || 0)
          .multipliedBy(item.costPrice || 0)
          .multipliedBy(item.discount || 0)
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

  return (
    <div className="px-4 py-2 text-center text-white rounded-md cursor-pointer md:px-auto bg-successBtn">
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
      setListDropdown([
        {
          measuredUnitId: 0,
          measuredUnitName: data?.defaultMeasuredUnit || "---",
        },
        ...data?.measuredUnits,
      ])
      setDefaultMeasuredUnit(data?.defaultMeasuredUnit || "---")
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
