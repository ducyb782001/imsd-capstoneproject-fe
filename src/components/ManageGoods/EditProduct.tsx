import React, { useEffect, useState } from "react"
import InfoIcon from "../icons/InfoIcon"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import Switch from "react-switch"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../../lib/constants"
import Tooltip from "../ToolTip"
import GarbageIcon from "../icons/GarbageIcon"
import AddUnitIcon from "../icons/AddUnitIcon"
import ReadOnlyField from "../ReadOnlyField"
import { IKImage } from "imagekitio-react"
import AddImage from "../AddImage"
import ConfirmPopup from "../ConfirmPopup"
import { useRouter } from "next/router"
import { useMutation, useQueries, useQueryClient } from "react-query"
import { getProductDetail, updateProduct } from "../../apis/product-module"
import BigNumber from "bignumber.js"
import { toast } from "react-toastify"
import { getListExportTypeGood } from "../../apis/type-good-module"
import {
  getListExportSupplier,
  getListSupplier,
} from "../../apis/supplier-module"
import { useTranslation } from "react-i18next"
import defaultProductImage from "../images/default-product-image.jpg"
import AddChooseSupplierDropdown from "./AddChooseSupplierDropdown"
import AddChooseTypeDropdown from "./AddChooseTypeDropdown"
import GeneralIcon from "../icons/GeneralIcon"
import ImportGoodIcon from "../icons/ImportGoodIcon"
import BarcodeIcon from "../icons/BarcodeIcon"

const TOAST_UPLOAD_IMAGE = "toast-upload-image"

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
  supplier: any
  category: any
  barcode: string
}

const TOAST_EDIT_PRODUCT_TYPE_ID = "toast-edit-product-type-id"

function EditProduct() {
  const [detailProduct, setDetailProduct] = useState<Product>()
  const [isCreateWarehouse, setIsCreateWarehouse] = useState(true)
  const [isAdditionalUnit, setIsAdditionalUnit] = useState(true)
  const [listUnits, setListUnits] = useState([])
  const [listOldUnits, setListOldUnits] = useState([])
  const { t } = useTranslation()
  const [newType, setNewType] = useState<string>("")
  const [newDetail, setNewDetail] = useState<string>("")
  // Right side bar
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeProduct, setTypeProduct] = useState<any>()
  const [isEnabled, setIsEnabled] = useState(true)

  const [imageUploaded, setImageUploaded] = useState("")
  const [loadingImage, setLoadingImage] = useState(false)

  const [listNhaCungCap, setListNhaCungCap] = useState<any>()
  const [listTypeProduct, setListTypeProduct] = useState([])

  const [isLoadingSupplier, setIsLoadingSupplier] = useState(true)

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
      setDetailProduct({
        ...detailProduct,
        measuredUnits: [...listOldUnits, ...listUnits],
      })
    }
  }, [listUnits])

  const onErrorUpload = (error: any) => {
    console.log("upload error", error)
    toast.dismiss(TOAST_UPLOAD_IMAGE)
    setLoadingImage(false)
  }

  const onSuccessUpload = (res: any) => {
    // setImages([...images, res.filePath])
    toast.dismiss(TOAST_UPLOAD_IMAGE)
    setImageUploaded(res.url)
    setLoadingImage(false)
  }

  const router = useRouter()
  const { productId } = router.query
  useEffect(() => {
    if (nhaCungCapSelected) {
      setDetailProduct({
        ...detailProduct,
        supplierId: nhaCungCapSelected.supplierId,
      })
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (typeProduct) {
      setDetailProduct({
        ...detailProduct,
        categoryId: typeProduct.categoryId,
      })
    }
  }, [typeProduct])

  useQueries([
    {
      queryKey: ["getProductDetail", productId],
      queryFn: async () => {
        if (productId) {
          const response = await getProductDetail(productId)
          setDetailProduct(response?.data)
          setIsEnabled(response?.data?.status)
          return response?.data
        }
      },
      enabled: !!productId,
    },
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

  useEffect(() => {
    if (imageUploaded) {
      setDetailProduct({
        ...detailProduct,
        image: imageUploaded,
      })
    }
  }, [imageUploaded])

  useEffect(() => {
    if (detailProduct) {
      setImageUploaded(detailProduct?.image)
      setListOldUnits(detailProduct?.measuredUnits)
    }
  }, [detailProduct])

  useEffect(() => {
    setDetailProduct({
      ...detailProduct,
      status: isEnabled,
    })
  }, [isEnabled])

  const queryClient = useQueryClient()

  const updateProductMutation = useMutation(
    async (editProduct) => {
      return await updateProduct(editProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_EDIT_PRODUCT_TYPE_ID)
          toast.success(t("update_product_success"))
          queryClient.invalidateQueries("getProductDetail")
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

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()
    toast.loading(t("operation_process"), {
      toastId: TOAST_EDIT_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    updateProductMutation.mutate({
      ...detailProduct,
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
          <PrimaryInput
            className="mt-6"
            title={
              <p>
                {t("product_name")} <span className="text-red-500">*</span>
              </p>
            }
            value={detailProduct?.productName ? detailProduct?.productName : ""}
            onChange={(e) => {
              setDetailProduct({
                ...detailProduct,
                productName: e.target.value,
              })
            }}
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="mb-2 text-sm font-bold text-gray">
                {t("supplier")}
                <span className="text-red-500"> *</span>
              </div>
              <AddChooseSupplierDropdown
                listDropdown={listNhaCungCap}
                textDefault={
                  `${detailProduct?.supplier?.supplierName} - ${detailProduct?.supplier?.supplierPhone}` ||
                  t("choose_supplier")
                }
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
                textDefault={
                  detailProduct?.category?.categoryName || t("choose_type")
                }
                showing={typeProduct}
                setShowing={setTypeProduct}
              />
            </div>

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
              value={
                detailProduct?.productCode ? detailProduct?.productCode : ""
              }
              onChange={(e) => {
                setDetailProduct({
                  ...detailProduct,
                  productCode: e.target.value,
                })
              }}
            />
            <PrimaryInput
              title="Mã barcode"
              value={detailProduct?.barcode ? detailProduct?.barcode : ""}
              onChange={(e) => {
                setDetailProduct({ ...detailProduct, barcode: e.target.value })
              }}
              accessoriesRight={<BarcodeIcon />}
            />
            <PrimaryInput
              title={t("product_unit")}
              value={
                detailProduct?.defaultMeasuredUnit
                  ? detailProduct?.defaultMeasuredUnit
                  : ""
              }
              onChange={(e) => {
                setDetailProduct({
                  ...detailProduct,
                  defaultMeasuredUnit: e.target.value,
                })
              }}
            />
            <div className="hidden md:block" />
            <PrimaryInput
              title={t("cost_price")}
              type="number"
              min="0"
              value={
                BigNumber(detailProduct?.costPrice).isGreaterThanOrEqualTo(0)
                  ? detailProduct?.costPrice
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value < 0 ? 0 : e.target.value
                setDetailProduct({
                  ...detailProduct,
                  costPrice: value,
                })
              }}
              accessoriesRight="đ"
            />
            <PrimaryInput
              title={t("sell_price")}
              type="number"
              min="0"
              accessoriesRight="đ"
              value={
                BigNumber(detailProduct?.sellingPrice).isGreaterThanOrEqualTo(0)
                  ? detailProduct?.sellingPrice
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value < 0 ? 0 : e.target.value
                setDetailProduct({
                  ...detailProduct,
                  sellingPrice: value,
                })
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
                  <ReadOnlyField
                    title={t("in_stock_first")}
                    type="number"
                    value={detailProduct?.inStock ? detailProduct?.inStock : ""}
                  />

                  <ReadOnlyField
                    title={t("cost_price")}
                    type="number"
                    value={
                      detailProduct?.stockPrice ? detailProduct?.stockPrice : ""
                    }
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
                  {listOldUnits?.length > 0 && (
                    <div className="">
                      {listOldUnits.map((i, index) => (
                        <TableOldUnitRow key={index} data={i} />
                      ))}
                    </div>
                  )}
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
                    product={detailProduct}
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
        imageUploaded={imageUploaded}
        onErrorUpload={onErrorUpload}
        onSuccessUpload={onSuccessUpload}
        setLoadingImage={setLoadingImage}
        loadingImage={loadingImage}
        setIsEnabled={setIsEnabled}
        isEnabled={isEnabled}
        handleClickSaveBtn={handleClickSaveBtn}
        setProduct={setDetailProduct}
        product={detailProduct}
      />
    </div>
  )
}

export default EditProduct

function RightSideProductDetail({
  imageUploaded,
  onErrorUpload,
  onSuccessUpload,
  setLoadingImage,
  loadingImage,
  setIsEnabled,
  isEnabled,
  handleClickSaveBtn,
  setProduct,
  product,
}) {
  const [disabled, setDisabled] = useState(true)
  const [warningStock, setWarningStock] = useState(false)

  useEffect(() => {
    if (product?.productName?.trim() == "" || product?.productName == null) {
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
        <p className="mb-5 text-xl font-semibold">{t("image_product")}</p>
        <div className="flex justify-center md:justify-start">
          <div
            className={`flex items-center justify-center border rounded-full ${
              imageUploaded ? "border-transparent" : "border-primary"
            }  w-[150px] h-[150px]`}
          >
            <AddImage
              onError={onErrorUpload}
              onSuccess={onSuccessUpload}
              imageUploaded={imageUploaded}
              setLoadingImage={setLoadingImage}
              toastLoadingId={TOAST_UPLOAD_IMAGE}
            >
              {loadingImage ? (
                <div className="w-full h-[176px] flex items-center justify-center">
                  <IKImage
                    src={`https://ik.imagekit.io/imsd/default-product-image_01tG1fPUP.jpg`}
                    className="!w-[170px] !h-[170px] rounded-md"
                  />
                </div>
              ) : imageUploaded ? (
                <IKImage
                  src={imageUploaded}
                  className="!w-[170px] !h-[170px] rounded-md"
                />
              ) : (
                ""
              )}
            </AddImage>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3">
          <ImportGoodIcon />
          <SmallTitle>{t("additional_information")}</SmallTitle>
        </div>

        <div className="mt-4 mb-2 text-sm font-bold text-gray">Ngưỡng tồn</div>
        <div className="flex items-center w-full gap-2">
          <PrimaryInput
            placeholder="Min"
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
            placeholder="Max"
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
            Ngưỡng tồn tối đa phải lớn hơn ngưỡng tồn tối thiểu
          </div>
        )}
        <PrimaryTextArea
          rows={4}
          className="mt-5"
          title={t("note_product")}
          value={product?.description ? product?.description : ""}
          onChange={(e) => {
            setProduct({ ...product, description: e.target.value })
          }}
        />

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
          title="Bạn có chắc chắn muốn chỉnh sửa sản phẩm không?"
          handleClickSaveBtn={handleClickSaveBtn}
          disabled={disabled || warningStock || !product?.productName}
        >
          {t("save_product")}
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
      (newType && newType.trim.toLowerCase()()) ===
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
        <p className="text-xs text-red-500">
          Tên của đơn vị quy đổi phải khác tên của đơn vị mặc định
        </p>
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
        value={data?.measuredUnitName ? data?.measuredUnitName : ""}
        readOnly
      />
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="10"
        title={t("number_in_unit")}
        value={data?.measuredUnitValue ? data?.measuredUnitValue : 0}
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

function TableOldUnitRow({ data }) {
  const { t } = useTranslation()
  return (
    <div className="grid items-end gap-2 mt-3 text-white grid-cols-454510 md:gap-5">
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md bg-[#F8F9FB] text-black border-[#DFE3E8] focus:border-[#DFE3E8]"
        placeholder={t("carton")}
        title={t("unit_same")}
        value={data?.measuredUnitName}
        readOnly
      />
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md bg-[#F8F9FB] text-black border-[#DFE3E8] focus:border-[#DFE3E8]"
        placeholder="10"
        title={t("number_in_unit")}
        value={data?.measuredUnitName}
        type="number"
        readOnly
      />
    </div>
  )
}
