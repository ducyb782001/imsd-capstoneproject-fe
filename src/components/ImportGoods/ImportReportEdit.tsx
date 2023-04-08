import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  getDetailImportProduct,
  updateImportProduct,
} from "../../apis/import-product-module"
import { getListExportProductBySupplier } from "../../apis/product-module"
import {
  getListExportSupplier,
  getListSupplier,
} from "../../apis/supplier-module"
import ConfirmPopup from "../ConfirmPopup"
import InfoIcon from "../icons/InfoIcon"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import StepBar from "../StepBar"
import Table from "../Table"
import Tooltip from "../ToolTip"
import AddProductPopup from "./AddProductPopup"
import ChooseUnitImport from "./ChooseUnitImport"
import SearchProductImportDropdown from "./SearchProductImportDropdown"
import { useRouter } from "next/router"
import AddChooseSupplierDropdown from "../ManageGoods/AddChooseSupplierDropdown"
import SecondaryBtn from "../SecondaryBtn"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import { useTranslation } from "react-i18next"
import ImportGoodIcon from "../icons/ImportGoodIcon"
import { countUndefinedOrEmptyAmount } from "../../hooks/useCountUndefinedAmount"
import DeleteDetail from "../DeleteDetail"
import { checkStringLength } from "../../lib"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function ImportReportEdit() {
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
              src={
                data?.product?.image ||
                data?.image ||
                "/images/default-product-image.jpg"
              }
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
          accessor: (data: any) => (
            <div
              className="cursor-pointer"
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

  const router = useRouter()
  const { importId } = router.query
  const [listNhaCungCap, setListNhaCungCap] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProductBySupplierImport, setListProductBySupplierImport] =
    useState<any>([])
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  // cai de gui di de update
  const [productImportObject, setProductImportObject] = useState<any>()
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const [detailResponse, setDetailResponse] = useState<any>()

  const [isLoadingSupplier, setIsLoadingSupplier] = useState(true)

  useEffect(() => {
    if (nhaCungCapSelected) {
      setProductImportObject({
        ...productImportObject,
        supplierId: nhaCungCapSelected?.supplierId,
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

  const updateImportMutation = useMutation(
    async (importProduct) => {
      return await updateImportProduct(importProduct)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("update_import_success"))
          router.push("/import-order-detail/" + importId)
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

  const handleClickUpdateBtn = async (event) => {
    event?.preventDefault()

    const count = countUndefinedOrEmptyAmount(listProductImport)

    if (count > 0) {
      toast.error(
        "Sản phẩm có số lượng xuất là 0. Vui lòng xóa sản phẩm đó để tiếp tục",
      )
      return
    }
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    await updateImportMutation.mutate({
      ...productImportObject,
    })
  }

  const result = useQueries([
    {
      queryKey: ["getDetailProductImport", importId],
      queryFn: async () => {
        const response = await getDetailImportProduct(importId)
        const detailReport = response?.data
        setListChosenProduct(detailReport?.importOrderDetails)
        setListProductImport(detailReport?.importOrderDetails)

        setProductImportObject({
          importId: detailReport?.importId,
          importCode: detailReport?.importCode,
          userId: detailReport?.user?.userId,
          supplierId: detailReport?.supplier?.supplierId,
          importOrderDetails: detailReport?.importOrderDetails,
          note: detailReport?.note,
        })
        setNhaCungCapSelected(response?.data?.supplier)
        setIsLoadingReport(response?.data?.isLoading)
        setDetailResponse(response?.data)
        return response?.data
      },
      enabled: !!importId,
    },
    {
      queryKey: ["getListSupplier"],
      queryFn: async () => {
        setIsLoadingSupplier(true)
        const response = await getListSupplier({
          offset: 0,
          limit: 1000,
          status: true,
        })
        setListNhaCungCap(response?.data?.data)
        setIsLoadingSupplier(false)

        return response?.data
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
          })
          setListProductBySupplierImport(response?.data)

          return response?.data
        }
      },
    },
  ])
  const data = result[0]

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-7525">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-2xl font-semibold">
                #{productImportObject?.importCode}
              </h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                {t("wait_accept_import")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <SecondaryBtn
                className="w-[120px]"
                onClick={() => {
                  router.push("/import-order-detail/" + importId)
                }}
              >
                {t("back")}
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title={t("confirm_update")}
                handleClickSaveBtn={handleClickUpdateBtn}
                disabled={
                  listChosenProduct?.length === 0 ||
                  productImportObject?.note?.length > 250
                }
              >
                {t("save")}
              </ConfirmPopup>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            {data?.data?.createdDate && (
              <StepBar
                status="pending"
                createdDate={format(
                  new Date(data?.data?.createdDate),
                  "dd/MM/yyyy HH:mm",
                )}
              />
            )}
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
              textDefault={productImportObject?.supplier?.supplierName}
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
          {detailResponse?.createdDate && (
            <div className="text-sm font-medium text-center text-gray">
              {t("created_report_import")}:{" "}
              {format(
                new Date(detailResponse?.createdDate),
                "dd/MM/yyyy HH:mm",
              )}
            </div>
          )}

          <div className="mt-3 text-sm font-bold text-gray">
            {t("staff_created")}
          </div>
          <div className="px-4 py-3 border rounded border-gray text-gray">
            {detailResponse?.user?.userName}
          </div>
          <div>
            <PrimaryTextArea
              rows={4}
              className="mt-2"
              title={t("note_report")}
              value={detailResponse?.note ? detailResponse?.note : ""}
              onChange={(e) => {
                setProductImportObject({
                  ...productImportObject,
                  note: e.target.value,
                })
              }}
            />
            {checkStringLength(productImportObject?.note, 250) && (
              <div className="text-sm text-red-500">
                Ghi chú tối đa 250 kí tự
              </div>
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
    if (data?.product) {
      const product = listProductImport?.filter(
        (i) => i.productId === data?.product?.productId,
      )
      if (!product[0]?.measuredUnitId) {
        const overAmount = new BigNumber(quantity)
          .plus(data?.product?.inStock ? data?.product?.inStock : 0)
          .isGreaterThan(data?.product?.maxStock)
        return (
          overAmount && (
            <p className="absolute text-xs text-dangerous">
              Số lượng nhập vượt định mức
            </p>
          )
        )
      } else {
        const quantityUnit = data?.product?.measuredUnits.filter(
          (i) => i.measuredUnitId === product[0]?.measuredUnitId,
        )[0].measuredUnitValue

        const overAmount = new BigNumber(quantity)
          .multipliedBy(quantityUnit)
          .plus(data?.product?.inStock ? data?.product?.inStock : 0)
          .isGreaterThan(data?.product?.maxStock)

        return (
          overAmount && (
            <p className="absolute text-xs text-dangerous">
              Số lượng nhập vượt định mức
            </p>
          )
        )
      }
    } else if (data?.productName) {
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
  const [discount, setDiscount] = useState(data?.discount)
  const handleOnChangeAmount = (value) => {
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
      min="0"
      placeholder="0"
      value={BigNumber(discount).isGreaterThanOrEqualTo(0) ? discount : ""}
      onChange={(e) => {
        e.stopPropagation()
        const value =
          e.target.value < 0 || e.target.value > 100 ? 0 : e.target.value
        setDiscount(value)
        handleOnChangeAmount(value)
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
    <div className="px-4 py-2 text-center text-white rounded-md cursor-pointer bg-successBtn">
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
