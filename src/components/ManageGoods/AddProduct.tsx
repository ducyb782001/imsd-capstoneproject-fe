import React, { useEffect, useState } from "react"
import InfoIcon from "../icons/InfoIcon"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import Switch from "react-switch"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../../lib/constants"
import Tooltip from "../ToolTip"
import PrimaryBtn from "../PrimaryBtn"
import GarbageIcon from "../icons/GarbageIcon"
import AddUnitIcon from "../icons/AddUnitIcon"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { addNewProduct } from "../../apis/product-module"
import { getListExportTypeGood } from "../../apis/type-good-module"
import { getListSupplier } from "../../apis/supplier-module"
import AddChooseSupplierDropdown from "./AddChooseSupplierDropdown"
import AddChooseTypeDropdown from "./AddChooseTypeDropdown"
import { useTranslation } from "react-i18next"
import ImportGoodIcon from "../icons/ImportGoodIcon"
import GeneralIcon from "../icons/GeneralIcon"
import BarcodeIcon from "../icons/BarcodeIcon"
import BigNumber from "bignumber.js"
import { checkStringLength } from "../../lib"
import UploadImage from "../UploadImage"
import useUploadImage from "../../hooks/useUploadImage"
import ConfirmPopup from "../ConfirmPopup"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

interface Product {
  productId: number
  productName: string
  productCode: string
  categoryId: number
  description: string
  supplierId: number
  costPrice: number
  sellingPrice: number
  defaultMeasuredUnit: string
  inStock: number
  stockPrice: number
  image: string
  measuredUnits: any
  status: boolean
  barcode: string
}

function AddProduct() {
  const [product, setProduct] = useState<Product>()
  const [isCreateWarehouse, setIsCreateWarehouse] = useState(false)
  const [isAdditionalUnit, setIsAdditionalUnit] = useState(false)
  const [listUnits, setListUnits] = useState([])
  const [newType, setNewType] = useState<string>("")
  const [newDetail, setNewDetail] = useState<string>("")
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeProduct, setTypeProduct] = useState<any>()
  const [isEnabled, setIsEnabled] = useState(true)
  const [listNhaCungCap, setListNhaCungCap] = useState<any>()
  const [listTypeProduct, setListTypeProduct] = useState([])
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(true)
  const { t } = useTranslation()

  const handleAddNewUnit = () => {
    if (newType && newDetail) {
      setListUnits([
        ...listUnits,
        {
          measuredUnitName: newType,
          measuredUnitValue: newDetail,
        },
      ])
      setNewType("")
      setNewDetail("")
    }
  }

  useEffect(() => {
    if (listUnits) {
      setProduct({
        ...product,
        measuredUnits: listUnits,
      })
    }
  }, [listUnits])

  useEffect(() => {
    if (nhaCungCapSelected) {
      setProduct({
        ...product,
        supplierId: nhaCungCapSelected.supplierId,
      })
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (typeProduct) {
      setProduct({
        ...product,
        categoryId: typeProduct.categoryId,
      })
    }
  }, [typeProduct])

  useQueries([
    {
      queryKey: ["getListTypeGood"],
      queryFn: async () => {
        const response = await getListExportTypeGood({})
        await setListTypeProduct(response?.data?.data)
        return response?.data
      },
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
        await setListNhaCungCap(response?.data?.data)
        setIsLoadingSupplier(false)

        return response?.data
      },
    },
  ])

  const router = useRouter()
  useEffect(() => {
    setProduct({
      ...product,
      status: true,
    })
  }, [isEnabled])

  const addNewProductMutation = useMutation(
    async (newProduct) => {
      return await addNewProduct(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("add_product_success"))
          router.push("/manage-products")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
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

  const handleAddNewProduct = () => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    addNewProductMutation.mutate({
      ...product,
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-73">
      <div>
        <div className="bg-white block-border">
          <div className="flex items-center gap-3">
            <GeneralIcon />
            <SmallTitle>{t("general_information")}</SmallTitle>
          </div>
          <div className="mt-6">
            <PrimaryInput
              title={
                <p>
                  {t("product_name")} <span className="text-red-500">*</span>
                </p>
              }
              onChange={(e) => {
                setProduct({ ...product, productName: e.target.value })
              }}
            />
            {checkStringLength(product?.productName, 100) && (
              <div className="text-sm text-red-500">
                {t("product_max_length")}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="mb-2 text-sm font-bold text-gray">
                {t("supplier")}
                <span className="text-red-500"> *</span>
              </div>
              <AddChooseSupplierDropdown
                listDropdown={listNhaCungCap}
                textDefault={t("choose_supplier")}
                showing={nhaCungCapSelected}
                setShowing={setNhaCungCapSelected}
                isLoadingSupplier={isLoadingSupplier}
              />
            </div>
            <div>
              <div className="mb-2 text-sm font-bold text-gray">
                {t("type.typeGoods")}
                <span className="text-red-500"> *</span>
              </div>
              <AddChooseTypeDropdown
                listDropdown={listTypeProduct}
                textDefault={t("choose_type")}
                showing={typeProduct}
                setShowing={setTypeProduct}
              />
            </div>
            <div>
              <PrimaryInput
                title={
                  <div className="flex gap-1">
                    <p>{t("product code")}</p>
                    <Tooltip
                      content={
                        <div>
                          {t("product_can_not_duplicate")}
                          <p>{t("head_of_product_code")}</p>
                        </div>
                      }
                    >
                      <InfoIcon />
                    </Tooltip>
                  </div>
                }
                onChange={(e) => {
                  setProduct({ ...product, productCode: e.target.value })
                }}
              />
              {checkStringLength(product?.productCode, 20) && (
                <div className="text-sm text-red-500">
                  {t("max_product_code")}
                </div>
              )}
            </div>
            <div>
              <PrimaryInput
                title="Mã/barcode"
                onChange={(e) => {
                  setProduct({ ...product, barcode: e.target.value })
                }}
                accessoriesRight={<BarcodeIcon />}
              />
              {checkStringLength(product?.barcode, 20) && (
                <div className="text-sm text-red-500">
                  {t("barcode_max_length")}
                </div>
              )}
            </div>
            <PrimaryInput
              title={t("product_unit")}
              onChange={(e) => {
                setProduct({ ...product, defaultMeasuredUnit: e.target.value })
              }}
            />
            <div className="hidden md:block" />
            <PrimaryInput
              title={t("cost_price")}
              type="number"
              min="0"
              value={
                BigNumber(product?.costPrice).isGreaterThanOrEqualTo(0)
                  ? product?.costPrice
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value < 0 ? 0 : e.target.value
                setProduct({ ...product, costPrice: value })
              }}
              accessoriesRight="đ"
            />
            <PrimaryInput
              title={t("sell_price")}
              type="number"
              min="0"
              value={
                BigNumber(product?.sellingPrice).isGreaterThanOrEqualTo(0)
                  ? product?.sellingPrice
                  : ""
              }
              accessoriesRight="đ"
              onChange={(e) => {
                const value = e.target.value < 0 ? 0 : e.target.value
                setProduct({ ...product, sellingPrice: value })
              }}
            />
          </div>
        </div>
        <div className="mt-4 bg-white block-border">
          <div className="flex items-center gap-2">
            <SmallTitle>{t("create_stock")}</SmallTitle>
            <Tooltip content={<div>{t("add_unit_info")}</div>}>
              <InfoIcon />
            </Tooltip>
            <Switch
              onChange={() => {
                setIsCreateWarehouse(!isCreateWarehouse)
              }}
              checked={isCreateWarehouse}
              width={44}
              height={24}
              className="ml-2 !opacity-100"
              uncheckedIcon={null}
              checkedIcon={null}
              offColor="#CBCBCB"
              onColor="#6A44D2"
            />
          </div>
          {isCreateWarehouse && (
            <AnimatePresence initial={false}>
              {isCreateWarehouse && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  className="grid grid-cols-2 mt-4 gap-7"
                >
                  <PrimaryInput
                    title={t("in_stock_first")}
                    type="number"
                    min="0"
                    value={
                      BigNumber(product?.inStock).isGreaterThanOrEqualTo(0)
                        ? product?.inStock
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value < 0 ? 0 : e.target.value
                      setProduct({ ...product, inStock: value })
                    }}
                  />
                  <PrimaryInput
                    title={t("cost_price")}
                    type="number"
                    min="0"
                    value={
                      BigNumber(product?.stockPrice).isGreaterThanOrEqualTo(0)
                        ? product?.stockPrice
                        : ""
                    }
                    accessoriesRight="đ"
                    onChange={(e) => {
                      const value = e.target.value < 0 ? 0 : e.target.value
                      setProduct({ ...product, stockPrice: value })
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="mt-4 bg-white block-border">
          <div className="flex items-center gap-2">
            <SmallTitle>{t("add_unit")}</SmallTitle>
            <Tooltip
              content={
                <div>
                  {t("more_unit_product")}
                  <p>{t("example_unit")}</p>
                </div>
              }
            >
              <InfoIcon />
            </Tooltip>
            <Switch
              onChange={() => {
                setIsAdditionalUnit(!isAdditionalUnit)
              }}
              checked={isAdditionalUnit}
              width={44}
              height={24}
              className="ml-2 !opacity-100"
              uncheckedIcon={null}
              checkedIcon={null}
              offColor="#CBCBCB"
              onColor="#6A44D2"
            />
          </div>
          {/* su dung trong cac page con lai */}
          {isAdditionalUnit && (
            <AnimatePresence initial={false}>
              {isAdditionalUnit && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  className=""
                >
                  {listUnits.length > 0 && (
                    <div className="">
                      {listUnits.map((i, index) => (
                        <TableUnitRow
                          key={`unit-row-${i?.type}-${index}`}
                          data={i}
                          itemIndex={index}
                          listUnits={listUnits}
                          setListUnits={setListUnits}
                        />
                      ))}
                    </div>
                  )}

                  <AdditionUnitRow
                    product={product}
                    newType={newType}
                    setNewType={setNewType}
                    newDetail={newDetail}
                    setNewDetail={setNewDetail}
                    handleAddNewUnit={handleAddNewUnit}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
      <RightSideProductDetail
        product={product}
        setProduct={setProduct}
        nhaCungCapSelected={nhaCungCapSelected}
        typeProduct={typeProduct}
        handleAddProduct={handleAddNewProduct}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
      />
    </div>
  )
}

export default AddProduct

function RightSideProductDetail({
  product,
  setProduct,
  nhaCungCapSelected,
  typeProduct,
  handleAddProduct,
  isEnabled,
  setIsEnabled,
}) {
  const [disabled, setDisabled] = useState(true)
  const [warningStock, setWarningStock] = useState(false)
  const { imageUrlResponse, handleUploadImage } = useUploadImage()

  useEffect(() => {
    if (imageUrlResponse) {
      setProduct({
        ...product,
        image: imageUrlResponse,
      })
    }
  }, [imageUrlResponse])

  useEffect(() => {
    if (
      nhaCungCapSelected == null ||
      typeProduct == null ||
      product.productName?.trim() == "" ||
      product.productName == null ||
      product?.productName?.length > 100 ||
      product?.barcode?.length > 20 ||
      product?.productCode?.length > 20 ||
      product?.description?.length > 250
    ) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  })

  useEffect(() => {
    if (
      BigNumber(product?.minStock).isGreaterThanOrEqualTo(product?.maxStock)
    ) {
      setWarningStock(true)
    } else {
      setWarningStock(false)
    }
  }, [product?.minStock, product?.maxStock])

  const { t } = useTranslation()
  return (
    <div className="">
      <div className="bg-white block-border h-[365px] flex flex-col items-center justify-center gap-4">
        <p className="mt-4 text-xl font-semibold">{t("image_product")}</p>

        <div className="flex justify-center md:justify-start">
          <div className="flex items-center justify-center border rounded-2xl border-primary w-[150px] h-[150px] mt-5">
            <UploadImage
              imageUrlResponse={imageUrlResponse}
              onChange={(e) => handleUploadImage(e)}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3">
          <ImportGoodIcon />
          <SmallTitle>{t("additional_information")}</SmallTitle>
        </div>
        <div className="mt-4 mb-2 text-sm font-bold text-gray">
          {t("max_int")}
        </div>
        <div className="flex items-center w-full gap-2">
          <PrimaryInput
            placeholder={t("below")}
            type="number"
            min="0"
            value={
              BigNumber(product?.minStock).isGreaterThanOrEqualTo(0)
                ? product?.minStock
                : ""
            }
            onChange={(e) => {
              const value = e.target.value < 0 ? 0 : e.target.value
              setProduct({ ...product, minStock: value })
            }}
          />
          <p>-</p>
          <PrimaryInput
            placeholder={t("above")}
            type="number"
            min="0"
            value={
              BigNumber(product?.maxStock).isGreaterThanOrEqualTo(0)
                ? product?.maxStock
                : ""
            }
            onChange={(e) => {
              const value = e.target.value < 0 ? 0 : e.target.value
              setProduct({ ...product, maxStock: value })
            }}
          />
        </div>
        {warningStock && (
          <div className="mt-1 text-xs text-red-500">
            {t("above_than_below")}
          </div>
        )}

        <PrimaryTextArea
          rows={4}
          className="mt-5"
          title={t("note_product")}
          onChange={(e) => {
            setProduct({ ...product, description: e.target.value })
          }}
        />
        {checkStringLength(product?.description, 250) && (
          <div className="text-sm text-red-500">{t("note_product_warn")}</div>
        )}
        <p className="mt-4">{t("status")}</p>
        <div className="flex items-center justify-between">
          <p className="text-gray">{t("can_sale")}</p>
          <Switch
            onChange={() => {
              setIsEnabled(!isEnabled)
            }}
            checked={isEnabled}
            width={44}
            height={24}
            className="ml-2 !opacity-100"
            uncheckedIcon={null}
            checkedIcon={null}
            offColor="#CBCBCB"
            onColor="#6A44D2"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-4 bg-white block-border">
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
          title={t("add_product_confirm")}
          handleClickSaveBtn={handleAddProduct}
          disabled={disabled || warningStock}
        >
          {t("add_product")}
        </ConfirmPopup>
      </div>
    </div>
  )
}

function AdditionUnitRow({
  product,
  newType,
  setNewType,
  newDetail,
  setNewDetail,
  handleAddNewUnit,
}) {
  const { t } = useTranslation()
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    if (
      (newType && newType.toLowerCase().trim()) ===
      (product?.defaultMeasuredUnit &&
        product?.defaultMeasuredUnit.toLowerCase().trim())
    ) {
      setWarning(true)
    } else {
      setWarning(false)
    }
  }, [newType, product])

  return (
    <div>
      <div className="grid items-end gap-2 mt-3 grid-cols-454510 md:gap-5">
        <PrimaryInput
          classNameInput="text-xs md:text-sm rounded-md"
          placeholder={t("carton")}
          title={t("unit_same")}
          onChange={(e) => setNewType(e.target.value)}
          value={newType}
        />
        <PrimaryInput
          classNameInput="text-xs md:text-sm rounded-md"
          placeholder="10"
          title={t("number_in_unit")}
          type="number"
          min="0"
          value={
            BigNumber(newDetail).isGreaterThanOrEqualTo(0) ? newDetail : ""
          }
          onChange={(e) => {
            const value = e.target.value < 0 ? 0 : e.target.value
            setNewDetail(value)
          }}
          onKeyPress={(e) => {
            // 13 is enter button
            if (e.key === "Enter" && !warning) {
              handleAddNewUnit()
            }
          }}
        />
        <div className="h-[46px] flex items-center justify-center">
          <AddUnitIcon
            className="cursor-pointer"
            onClick={() => {
              if (!warning) {
                handleAddNewUnit()
              }
            }}
          />
        </div>
      </div>
      {warning && (
        <p className="text-xs text-red-500">{t("name_same_unnit")}</p>
      )}
    </div>
  )
}

function TableUnitRow({ data, listUnits, setListUnits, itemIndex }) {
  const handleRemoveProperty = () => {
    const listRemove = listUnits.filter((i, index) => index !== itemIndex)
    setListUnits(listRemove)
  }
  const { t } = useTranslation()
  return (
    <div className="grid items-end gap-2 mt-3 text-white grid-cols-454510 md:gap-5">
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder={t("carton")}
        title={t("unit_same")}
        value={data?.measuredUnitName}
        readOnly
      />
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="10"
        title={t("number_in_unit")}
        value={data?.measuredUnitValue}
        type="number"
        readOnly
      />
      <div className="h-[46px] flex items-center justify-center cursor-pointer">
        <div onClick={handleRemoveProperty}>
          <GarbageIcon />
        </div>
      </div>
    </div>
  )
}
