import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { getListExportProduct } from "../../apis/product-module"
import { getAllStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import { useRouter } from "next/router"
import SecondaryBtn from "../SecondaryBtn"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import {
  getDetailExportProduct,
  updateExportProduct,
} from "../../apis/export-product-module"
import { useTranslation } from "react-i18next"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import { countUndefinedOrEmptyAmount } from "../../hooks/useCountUndefinedAmount"
import { checkStringLength } from "../../lib"
import SearchProductExportDropdown from "./SearchProductExportDropdown"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ExportOrderEdit() {
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
              src={data?.product?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName || data?.productName}
            </p>
          ),
        },
        {
          Header: t("export_number"),
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
          Header: t("discount"),
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
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

  const router = useRouter()
  const { exportId } = router.query
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProduct, setListProduct] = useState<any>([])
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)

  // cai de gui di de update
  const [productImportObject, setProductImportObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const [detailResponse, setDetailResponse] = useState<any>()

  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (staffSelected) {
      setProductImportObject({
        ...productImportObject,
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
    if (listChosenProduct) {
      const list = listChosenProduct.map((item) => {
        const discount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.discount
        const amount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const price = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.price

        return {
          productId: item.productId,
          amount: amount,
          price: price,
          discount: discount,
          measuredUnitId:
            listProductImport.find((i) => i.productId == item.productId)
              ?.measuredUnitId || 0,
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
      setProductImportObject({
        ...productImportObject,
        exportOrderDetails: listProductImport,
        totalPrice: new BigNumber(price).toFixed(),
      })
      setSubmitted(false)
    }
  }, [listProductImport])

  const updateImportMutation = useMutation(
    async (importProduct) => {
      return await updateExportProduct(importProduct)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("export_edit_success"))
          setSubmitted(false)
          router.push("/export-order-detail/" + exportId)
        } else {
          setSubmitted(false)
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data || t("error_occur"))
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
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

  const handleClickUpdateBtn = async (event) => {
    event?.preventDefault()

    const count = countUndefinedOrEmptyAmount(listProductImport)
    if (count > 0) {
      toast.error(t("export_number_0"))
      return
    }

    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    setSubmitted(true)

    await updateImportMutation.mutate(productImportObject)
  }

  const handleClickOutBtn = () => {
    router.push("/export-order-detail/" + exportId)
  }

  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        const detailReport = response?.data
        setListChosenProduct(detailReport?.exportOrderDetails)
        setListProductImport(detailReport?.exportOrderDetails)

        setProductImportObject({
          exportId: detailReport?.exportId,
          exportCode: detailReport?.exportCode,
          userId: detailReport?.user?.userId,
          exportOrderDetails: detailReport?.exportOrderDetails,
          note: detailReport?.note,
        })

        setDetailResponse(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!exportId,
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        setIsLoadingStaff(true)
        const response = await getAllStaff({
          offset: 0,
          limit: 1000,
          status: true,
        })
        setListStaff(response?.data?.data)
        setIsLoadingStaff(false)

        return response?.data?.data
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

        setListProduct(response?.data)
        return response?.data?.data
      },
    },
  ])

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImportObject?.exportCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                {t("wait_accept_import")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
                {t("exit")}
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title={t("confirm_update")}
                handleClickSaveBtn={handleClickUpdateBtn}
                disabled={
                  submitted ||
                  listChosenProduct?.length === 0 ||
                  productImportObject?.note?.length > 250
                }
              >
                {t("update")}
              </ConfirmPopup>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            {detailResponse?.createdDate && (
              <StepBar
                status="pending"
                createdDate={format(
                  new Date(detailResponse?.createdDate),
                  "dd/MM/yyyy HH:mm",
                )}
              />
            )}
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">{t("choose_staff")}</h1>
            </div>
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={detailResponse?.user?.userName}
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
          {detailResponse?.createdDate && (
            <div className="text-sm font-medium text-center text-gray">
              {t("created_report_import")}:{" "}
              {format(
                new Date(detailResponse?.createdDate),
                "dd/MM/yyyy HH:mm",
              )}
            </div>
          )}
          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title={t("note_report")}
            value={productImportObject?.note}
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
          <div className="text-base font-semibold">{t("price_overall")}</div>
          {new BigNumber(totalPriceSend).toFormat(0)} đ
        </div>
      </div>
    </div>
  )
}

export default ExportOrderEdit

function ListQuantitiveImport({
  data,
  listProductImport,
  setListProductImport,
}) {
  const [quantity, setQuantity] = useState(data?.amount)
  const [inStockData, setInStockData] = useState<any>()

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

  useEffect(() => {
    if (listProductImport && data?.product) {
      const product = listProductImport.filter(
        (i) => i.productId === data?.productId,
      )

      if (!product[0]?.measuredUnitId) {
        setInStockData(data?.product?.inStock)
      } else {
        const inStock = data?.product?.inStock
        const measuredUnitValue = data?.product?.measuredUnits.filter(
          (i) => i.measuredUnitId === product[0].measuredUnitId,
        )[0].measuredUnitValue
        const showValue = BigNumber(inStock)
          .dividedBy(measuredUnitValue || 1)
          .decimalPlaces(0, BigNumber.ROUND_DOWN)
          .toNumber()
        setInStockData(showValue)
      }
    } else if (listProductImport && data?.productName) {
      const product = listProductImport.filter(
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
  }, [listProductImport])
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

function ListPriceImport({ data, listProductImport, setListProductImport }) {
  const [costPrice, setCostPrice] = useState()
  const { t } = useTranslation()

  useEffect(() => {
    if (data && data?.product) {
      setCostPrice(data?.price)
    } else if (data && data?.productName) {
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

  const renderWarningPrice = () => {
    if (data?.product) {
      const product = listProductImport?.filter(
        (i) => i.productId === data?.product?.productId,
      )
      if (!product[0]?.measuredUnitId) {
        const importPrice = data?.product?.costPrice
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
        const quantityUnit = data?.product?.measuredUnits.filter(
          (i) => i.measuredUnitId === product[0]?.measuredUnitId,
        )[0].measuredUnitValue

        const checkLessPrice = new BigNumber(costPrice).isLessThan(
          BigNumber(data?.product?.costPrice || 1).multipliedBy(quantityUnit),
        )

        return (
          checkLessPrice && (
            <p className="absolute text-xs text-dangerous">
              {t("warning_price_export")}
            </p>
          )
        )
      }
    } else if (data?.productName) {
      const product = listProductImport?.filter(
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

function ListDiscountImport({ data, listProductImport, setListProductImport }) {
  const [discount, setDiscount] = useState(data?.discount)

  const handleOnChangeDiscount = (value) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, discount: value ? value : 0 }
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
        handleOnChangeDiscount(value)
      }}
    />
  )
}

function CountTotalPrice({ data, listProductImport }) {
  const [price, setPrice] = useState<any>()
  const handleSetPrice = () => {
    const list = listProductImport
    list.map((item) => {
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
  }, [listProductImport])

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
    if (data?.product) {
      const list = listProductImport
      setListDropdown([
        {
          measuredUnitId: 0,
          measuredUnitName: data?.product?.defaultMeasuredUnit || "---",
        },
        ...data?.product?.measuredUnits,
      ])
      const test = list.filter((i) => i?.productId === data?.product?.productId)
      if (test[0].measuredUnitId) {
        setDefaultMeasuredUnit(test[0]?.measuredUnit?.measuredUnitName)
      } else {
        setDefaultMeasuredUnit(test[0]?.defaultMeasuredUnit || "---")
      }
    }
  }, [data?.product])

  useEffect(() => {
    if (data?.productName) {
      const list = listProductImport
      setListDropdown([
        {
          measuredUnitId: 0,
          measuredUnitName: data?.defaultMeasuredUnit || "---",
        },
        ...data?.measuredUnits,
      ])
      setDefaultMeasuredUnit(data?.defaultMeasuredUnit || "---")
    }
  }, [data?.productName])

  useEffect(() => {
    if (unitChosen && data?.product) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data?.product.productId) {
          return {
            ...item,
            measuredUnitId: unitChosen?.measuredUnitId,
          }
        }
        return item
      })
      setListProductImport(newList)
    } else if (unitChosen && data?.productName) {
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
