import BigNumber from "bignumber.js"
import { format, parseISO } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createExportProduct } from "../../apis/export-product-module"
import { getListExportProduct } from "../../apis/product-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getAllStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"
import { countUndefinedOrEmptyAmount } from "../../hooks/useCountUndefinedAmount"
import SearchProductExportDropdown from "./SearchProductExportDropdown"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import { checkStringLength } from "../../lib"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function CreateExportGood() {
  const { t } = useTranslation()
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("numerical_order"),
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
          Header: t("export_number"),
          accessor: (data: any) => (
            <ListQuantitiveExport
              data={data}
              listProductExport={listProductExport}
              setListProductExport={setListProductExport}
            />
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <ListUnitExport
              data={data}
              listProductExport={listProductExport}
              setListProductExport={setListProductExport}
            />
          ),
        },
        {
          Header: t("price"),
          accessor: (data: any) => (
            <div className="flex items-center justify-center gap-2">
              <ListPriceExport
                data={data}
                listProductExport={listProductExport}
                setListProductExport={setListProductExport}
              />
              <p>đ</p>
            </div>
          ),
        },
        {
          Header: t("discount"),
          accessor: (data: any) => (
            <div className="flex items-center justify-center gap-1">
              <ListDiscountExport
                data={data}
                listProductExport={listProductExport}
                setListProductExport={setListProductExport}
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
              listProductExport={listProductExport}
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
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductExport, setListProductExport] = useState<any>([])
  const [listProduct, setListProduct] = useState<any>([])
  const [productExportObject, setProductExportObject] = useState<any>()
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)

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
      setProductExportObject({
        ...productExportObject,
        userId: staffSelected?.userId,
      })
    }
  }, [staffSelected])

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
        const discount = listProductExport.find(
          (i) => i.productId == item.productId,
        )?.discount
        const amount = listProductExport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const price = listProductExport.find(
          (i) => i.productId == item.productId,
        )?.price

        return {
          productId: item.productId,
          amount: amount,
          discount: discount,
          price: price,
          measuredUnitId: listProductExport.find(
            (i) => i.productId == item.productId,
          )?.measuredUnitId,
        }
      })

      setListProductExport(list)
    } else {
      setTotalPriceSend(0)
    }
    setProductChosen(null)
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductExport) {
      const price = listProductExport.reduce((accumulator, currentProduct) => {
        const cost = new BigNumber(currentProduct.price || 0).times(
          currentProduct.amount || 0,
        )
        if (currentProduct.discount) {
          const discountPrice = new BigNumber(currentProduct.amount || 0)
            .multipliedBy(currentProduct.price || 0)
            .multipliedBy(currentProduct.discount || 0)
            .dividedBy(100)
          return accumulator.plus(cost).minus(discountPrice)
        } else {
          return accumulator.plus(cost)
        }
      }, new BigNumber(0))
      setTotalPriceSend(price)
      setProductExportObject({
        ...productExportObject,
        exportOrderDetails: listProductExport,
        totalPrice: new BigNumber(price).toFixed(),
      })

      for (let index = 0; index < listProductExport.length; index++) {
        const product = listProductExport[index]
        if (!product.measuredUnitId) {
          if (
            new BigNumber(listProductExport[index]?.amount).isGreaterThan(
              listChosenProduct[index]?.inStock
                ? listChosenProduct[index]?.inStock
                : 0,
            )
          ) {
            setSubmitted(true)
            return
          }
        } else {
          const eachProduct = listChosenProduct[index]?.measuredUnits?.filter(
            (i) =>
              i.measuredUnitId === listProductExport[index]?.measuredUnitId,
          )[0]
          const amountExportvalue = BigNumber(
            listChosenProduct[index]?.inStock || 1,
          )
            .dividedBy(eachProduct?.measuredUnitValue || 1)
            .decimalPlaces(0, BigNumber.ROUND_DOWN)
            .toNumber()

          if (
            new BigNumber(listProductExport[index].amount).isGreaterThan(
              amountExportvalue,
            )
          ) {
            setSubmitted(true)
            return
          }
        }
      }
      setSubmitted(false)
    }
  }, [listProductExport])

  const router = useRouter()
  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        setIsLoadingStaff(true)
        const staff = await await getAllStaff({
          offset: 0,
          limit: 1000,
          status: true,
        })
        setListStaff(staff?.data?.data)
        setIsLoadingStaff(false)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getListExportProduct({
          offset: 0,
          limit: 1000,
          status: true,
        })

        setProductExportObject({
          ...productExportObject,
          exportId: 0,
          state: 0,
          exportCode: "string",
        })
        setListProduct(response?.data)
        return response?.data
      },
    },
  ])

  const createExportMutation = useMutation(
    async (exportProduct) => {
      return await createExportProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("toast_add_export_success"))
          setSubmitted(false)
          router.push("/manage-export-orders")
        } else {
          setSubmitted(false)
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
    const count = countUndefinedOrEmptyAmount(listProductExport)

    if (count > 0) {
      toast.error(t("export_number_0"))
      return
    }

    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })

    setSubmitted(true)
    const submittedData = {
      ...productExportObject,
    }
    if (!staffSelected) {
      submittedData["userId"] = userData.userId
    }

    createExportMutation.mutate(submittedData)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <h1 className="text-2xl font-semibold">{t("add_export_title")}</h1>
          <div className="flex justify-center mt-6">
            <StepBar />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">
                {t("staff_create_export")}
              </h1>
            </div>
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={userData?.userName}
              showing={staffSelected}
              setShowing={setStaffSelected}
              isLoadingStaff={isLoadingStaff}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            {t("additional_information")}
          </h1>
          <PrimaryTextArea
            rows={8}
            className="mt-5"
            title={t("note_report")}
            onChange={(e) => {
              setProductExportObject({
                ...productExportObject,
                note: e.target.value,
              })
            }}
          />
          {checkStringLength(productExportObject?.note, 250) && (
            <div className="text-sm text-red-500">{t("note_warning")}</div>
          )}
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ExportGoodsIcon />
          <h1 className="text-xl font-semibold">{t("export_product_infor")}</h1>
        </div>
        <SearchProductExportDropdown
          listDropdown={listProduct?.data}
          textDefault={t("supplier")}
          placeholder={t("search.searchInGoods")}
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
            productExportObject?.note?.length > 250
          }
        >
          {t("add_export_title")}
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateExportGood

function ListQuantitiveExport({
  data,
  listProductExport,
  setListProductExport,
}) {
  const [quantity, setQuantity] = useState()
  const [inStockData, setInStockData] = useState<any>()

  const handleOnChangeAmount = (value, data) => {
    const list = listProductExport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, amount: value }
      }
      return item
    })
    setListProductExport(newList)
  }

  useEffect(() => {
    if (listProductExport) {
      const product = listProductExport.filter(
        (i) => i.productId === data?.productId,
      )

      if (!product[0]?.measuredUnitId) {
        setInStockData(data?.inStock)
      } else {
        const inStock = data?.inStock
        const measuredUnitValue = data?.measuredUnits.filter(
          (i) => i.measuredUnitId === product[0].measuredUnitId,
        )[0].measuredUnitValue
        const showValue = BigNumber(inStock)
          .dividedBy(measuredUnitValue || 1)
          .decimalPlaces(0, BigNumber.ROUND_DOWN)
          .toNumber()
        setInStockData(showValue)
      }
    }
  }, [listProductExport])
  const { t } = useTranslation()

  return (
    <div className="w-[100px] relative">
      <div className="flex items-center gap-1">
        <PrimaryInput
          className="w-[60px]"
          classNameInput="!px-2"
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
        <p>/{inStockData}</p>
      </div>
      {new BigNumber(quantity).isGreaterThan(inStockData ? inStockData : 0) && (
        <p className="absolute text-xs text-dangerous">
          {t("warning_amount_export")}
        </p>
      )}
    </div>
  )
}

function ListPriceExport({ data, listProductExport, setListProductExport }) {
  const [costPrice, setCostPrice] = useState<any>()

  useEffect(() => {
    if (data) {
      setCostPrice(BigNumber(data?.sellingPrice).toFormat(0))
    }
  }, [data])
  const { t } = useTranslation()

  useEffect(() => {
    if (costPrice) {
      const list = listProductExport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, price: costPrice }
        }
        return item
      })
      setListProductExport(newList)
    }
  }, [costPrice])

  const renderWarningPrice = () => {
    const product = listProductExport?.filter(
      (i) => i.productId === data?.productId,
    )
    if (!product[0]?.measuredUnitId) {
      const importPrice = data?.costPrice
      const checkLessPrice = new BigNumber(costPrice).isLessThan(
        importPrice || 0,
      )
      return (
        checkLessPrice && (
          <p className="absolute text-xs text-dangerous">
            {t("warning_price_export")}
          </p>
        )
      )
    } else {
      const quantityUnit = data?.measuredUnits.filter(
        (i) => i.measuredUnitId === product[0]?.measuredUnitId,
      )[0].measuredUnitValue

      const checkLessPrice = new BigNumber(costPrice).isLessThan(
        BigNumber(data?.costPrice || 1).multipliedBy(quantityUnit),
      )

      return (
        checkLessPrice && (
          <p className="absolute text-xs text-dangerous">
            {t("warning_price_export")}
          </p>
        )
      )
    }
  }

  return (
    <div className="w-[100px] relative">
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
      {renderWarningPrice()}
    </div>
  )
}

function ListDiscountExport({ data, listProductExport, setListProductExport }) {
  const [discount, setDiscount] = useState()
  const handleOnChangeDiscount = (value, data) => {
    const list = listProductExport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, discount: value }
      }
      return item
    })
    setListProductExport(newList)
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
        handleOnChangeDiscount(value, data)
      }}
    />
  )
}

function CountTotalPrice({ data, listProductExport }) {
  const [price, setPrice] = useState<any>()
  const handleSetPrice = () => {
    const list = listProductExport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const totalPrice = new BigNumber(item.amount || 0).multipliedBy(
          item.price || 0,
        )
        const discountPrice = new BigNumber(item.amount || 0)
          .multipliedBy(item.price || 0)
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
  }, [listProductExport])

  return (
    <div className="py-2 text-center text-white rounded-md cursor-pointer bg-successBtn">
      {new BigNumber(price).toFormat(0)} đ
    </div>
  )
}

function ListUnitExport({ data, listProductExport, setListProductExport }) {
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
      const list = listProductExport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return {
            ...item,
            measuredUnitId: unitChosen?.measuredUnitId,
          }
        }
        return item
      })
      setListProductExport(newList)
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
