import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { getListExportProduct } from "../../apis/product-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import InfoIcon from "../icons/InfoIcon"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import Tooltip from "../ToolTip"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import SearchProductImportDropdown from "../ImportGoods/SearchProductImportDropdown"
import { useRouter } from "next/router"
import SecondaryBtn from "../SecondaryBtn"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import {
  getDetailExportProduct,
  updateExportProduct,
} from "../../apis/export-product-module"
import { useTranslation } from "react-i18next"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ImportReportEdit() {
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
  const [autoUpdatePrice, setAutoUpdatePrice] = useState(true)
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
    }
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

      for (let index = 0; index < listProductImport.length; index++) {
        const product = listProductImport[index]
        if (!product.measuredUnitId) {
          if (
            listProductImport[index]?.amount >
            listChosenProduct[index].product.inStock
          ) {
            setSubmitted(true)
            return
          }
        } else {
          const eachProduct = listChosenProduct[
            index
          ]?.product?.measuredUnits.filter(
            (i) => i.measuredUnitId === listProductImport[index].measuredUnitId,
          )[0]
          if (listProductImport[index].amount > eachProduct.inStock) {
            setSubmitted(true)
            return
          }
        }
      }
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
          router.push("/export-report-draff/" + exportId)
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
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

  const handleClickUpdateBtn = async (event) => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    event?.preventDefault()
    await updateImportMutation.mutate(productImportObject)
  }

  const handleClickOutBtn = () => {
    router.push("/export-report-draff/" + exportId)
  }

  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        const detailReport = response?.data
        setListChosenProduct(response?.data?.exportOrderDetails)
        setListProductImport(response?.data?.exportOrderDetails)

        setProductImportObject({
          exportId: detailReport?.exportId,
          exportCode: detailReport?.exportCode,
          userId: detailReport?.user?.userId,
          exportOrderDetails: detailReport?.exportOrderDetails,
          note: detailReport?.note,
        })

        // setProductImportObject(response?.data)
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
        const response = await getListStaff()
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
                disabled={submitted}
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
              <Tooltip content={t("choose_supplier_product")}>
                <InfoIcon />
              </Tooltip>
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
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ExportGoodsIcon />
          <h1 className="text-xl font-semibold">{t("export_product_infor")}</h1>
        </div>
        <SearchProductImportDropdown
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

export default ImportReportEdit

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
    if (listProductImport) {
      const product = listProductImport.filter(
        (i) => i.productId === data?.productId,
      )

      if (!product[0]?.measuredUnitId) {
        const inStock = data?.product?.inStock
        setInStockData(inStock)
      } else {
        const inStockUnit = data?.product?.measuredUnits?.filter(
          (i) => i.measuredUnitId === product[0]?.measuredUnitId,
        )
        setInStockData(inStockUnit[0].inStock)
      }
    }
  }, [listProductImport])

  return (
    <div className="w-[100px] relative">
      <div className="flex items-center gap-1">
        <PrimaryInput
          className="w-[60px]"
          type="number"
          placeholder="0"
          value={quantity ? quantity : ""}
          onChange={(e) => {
            e.stopPropagation()
            setQuantity(e.target.value)
            handleOnChangeAmount(e.target.value, data)
          }}
        />
        <p>/{inStockData}</p>
      </div>
      {new BigNumber(quantity).isGreaterThan(inStockData ? inStockData : 0) && (
        <p className="absolute text-xs text-dangerous">
          Số lượng xuất lớn hơn số lượng tồn
        </p>
      )}
    </div>
  )
}

function ListPriceImport({ data, listProductImport, setListProductImport }) {
  const [costPrice, setCostPrice] = useState(data?.price)

  const handleOnChangeAmount = (value) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, price: value }
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
        handleOnChangeAmount(e.target.value)
      }}
    />
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
      className="w-[50px]"
      type="number"
      placeholder="0"
      value={discount ? discount : ""}
      onChange={(e) => {
        e.stopPropagation()
        setDiscount(e.target.value)
        handleOnChangeDiscount(e.target.value)
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
    if (data) {
      const list = listProductImport
      setListDropdown([
        {
          measuredUnitId: 0,
          measuredUnitName: data?.defaultMeasuredUnit || "---",
        },
        ...data?.measuredUnits,
      ])
      const test = list.filter((i) => i?.productId === data?.productId)
      if (test[0].measuredUnitId) {
        setDefaultMeasuredUnit(test[0]?.measuredUnit?.measuredUnitName)
      } else {
        setDefaultMeasuredUnit(test[0]?.defaultMeasuredUnit || "---")
      }
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
