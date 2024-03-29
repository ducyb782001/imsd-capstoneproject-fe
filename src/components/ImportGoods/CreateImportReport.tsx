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
import { getAllStaff } from "../../apis/user-module"
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
import { checkStringLength } from "../../lib"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"
function CreateImportReport() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("no"),
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: t("image"),
          accessor: (data: any) => (
            <img
              src={data?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
          ),
        },
        {
          Header: t("import_number"),
          accessor: (data: any) => (
            <ListQuantitiveImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <ListUnitImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: t("price"),
          accessor: (data: any) => (
            <div className="flex items-center justify-center gap-2">
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
          Header: t("discount"),
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
          Header: t("total_price"),
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
          toast.success(t("create_import_order_success"))
          router.push("/manage-import-orders")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data || t("error_occur"))
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                t("error_occur"),
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
      toast.error(t("export_number_0"))
      return
    }

    toast.loading(t("operation_process"), {
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
        const staff = await getAllStaff({
          offset: 0,
          limit: 1000,
          status: true,
        })
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
          <h1 className="text-2xl font-semibold">{t("create_import_order")}</h1>
          <div className="flex justify-center mt-6">
            <StepBar />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("choose_supplier")}</h1>
              <Tooltip content={t("choose_supplier_to_choose_product")}>
                <InfoIcon />
              </Tooltip>
            </div>
            <AddChooseSupplierDropdown
              listDropdown={listNhaCungCap}
              textDefault={t("supplier")}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
              isLoadingSupplier={isLoadingSupplier}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            {t("additional_information")}
          </h1>
          <div className="mt-3 text-sm font-bold text-gray">
            {t("choose_staff")}
          </div>
          <ChooseStaffDropdown
            listDropdown={listStaff}
            textDefault={userData?.userName || t("choose_staff")}
            showing={staffSelected}
            setShowing={setStaffSelected}
            isLoadingStaff={isLoadingSupplier}
          />
          <div>
            <PrimaryTextArea
              rows={4}
              className="mt-2"
              title={t("note_report")}
              onChange={(e) => {
                setProductImportObject({
                  ...productImportObject,
                  note: e.target.value,
                })
              }}
            />
            {checkStringLength(productImportObject?.note, 250) && (
              <div className="text-sm text-red-500">{t("note_warning")}</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ImportGoodIcon />
          <h1 className="text-xl font-semibold">{t("import_product_list")}</h1>
        </div>
        <SearchProductImportDropdown
          listDropdown={listProductBySupplierImport?.data}
          placeholder={t("search.searchInGoods")}
          textDefault={t("supplier")}
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
            {t("price_overall")} {new BigNumber(totalPriceSend).toFormat(0)} đ
          </div>
        </div>
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title={t("create_export_alert")}
          handleClickSaveBtn={handleClickSaveBtn}
          disabled={
            submitted ||
            listChosenProduct?.length === 0 ||
            productImportObject?.note?.length > 250
          }
        >
          {t("create_import_order")}
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
  const { t } = useTranslation()
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
            {t("import_over_amount")}
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
            {t("import_over_amount")}
          </p>
        )
      )
    }
  }

  return (
    <div className="relative">
      <PrimaryInput
        className="w-[60px]"
        classNameInput="!px-1"
        type="number"
        min="0"
        placeholder="0"
        value={BigNumber(quantity).isGreaterThanOrEqualTo(0) ? quantity : ""}
        onChange={(e) => {
          e.stopPropagation()
          console.log(e)

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
  const [costPrice, setCostPrice] = useState<any>()

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
      className="w-[44px]"
      classNameInput="!px-2"
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
  const { t } = useTranslation()
  return (
    <div className="px-4 py-2 text-center text-white rounded-md cursor-pointer md:px-auto bg-successBtn">
      {new BigNumber(price).toFormat(0)} {t("vnd")}
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
