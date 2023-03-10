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
import { getListExportSupplier } from "../../apis/supplier-module"
import { useTranslation } from "react-i18next"
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
    if (nhaCungCapSelected == undefined || typeProduct == undefined) {
      setNhaCungCapSelected(detailProduct?.supplier?.supplierName)
      setTypeProduct(detailProduct?.category?.categoryName)
    }
  })
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
    setLoadingImage(false)
  }

  const onSuccessUpload = (res: any) => {
    // setImages([...images, res.filePath])
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
          return response?.data
        }
      },
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
        const response = await getListExportSupplier({})
        await setListNhaCungCap(response?.data?.data)
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
          router.push("/manage-goods")
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
          <SmallTitle>{t("general_information")}</SmallTitle>
          <PrimaryInput
            className="mt-6"
            title={
              <p>
                {t("product_name")} <span className="text-red-500">*</span>
              </p>
            }
            value={detailProduct?.productName}
            onChange={(e) => {
              setDetailProduct({
                ...detailProduct,
                productName: e.target.value,
              })
            }}
          />
          <div className="grid grid-cols-2 mt-4 gap-7">
            <PrimaryInput
              title={t("product code")}
              value={detailProduct?.productCode}
              onChange={(e) => {
                setDetailProduct({
                  ...detailProduct,
                  productCode: e.target.value,
                })
              }}
            />
            <PrimaryInput
              title={t("product_unit")}
              value={detailProduct?.defaultMeasuredUnit}
              onChange={(e) => {
                setDetailProduct({
                  ...detailProduct,
                  defaultMeasuredUnit: e.target.value,
                })
              }}
            />
            <PrimaryInput
              title={t("cost_price")}
              type="number"
              value={new BigNumber(detailProduct?.costPrice).toFormat()}
              onChange={(e) => {
                setDetailProduct({
                  ...detailProduct,
                  costPrice: e.target.value,
                })
              }}
            />
            <PrimaryInput
              title={t("sell_price")}
              type="number"
              value={new BigNumber(detailProduct?.sellingPrice).toFormat()}
              onChange={(e) => {
                setDetailProduct({
                  ...detailProduct,
                  sellingPrice: e.target.value,
                })
              }}
            />
          </div>
          <PrimaryTextArea
            title={t("note_product")}
            value={detailProduct?.description}
            onChange={(e) => {
              setDetailProduct({
                ...detailProduct,
                description: e.target.value,
              })
            }}
          />
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
                    value={new BigNumber(detailProduct?.inStock).toFormat()}
                  />

                  <ReadOnlyField
                    title={t("cost_price")}
                    type="number"
                    value={new BigNumber(detailProduct?.stockPrice)}
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
        nhaCungCapSelected={nhaCungCapSelected}
        setNhaCungCapSelected={setNhaCungCapSelected}
        typeProduct={typeProduct}
        setTypeProduct={setTypeProduct}
        setIsEnabled={setIsEnabled}
        isEnabled={isEnabled}
        handleClickSaveBtn={handleClickSaveBtn}
        listNhaCungCap={listNhaCungCap}
        listTypeProduct={listTypeProduct}
      />
    </div>
  )
}

export default EditProduct
import defaultProductImage from "../images/default-product-image.jpg"
import AddChooseSupplierDropdown from "./AddChooseSupplierDropdown"
import AddChooseTypeDropdown from "./AddChooseTypeDropdown"
function RightSideProductDetail({
  imageUploaded,
  onErrorUpload,
  onSuccessUpload,
  setLoadingImage,
  loadingImage,
  nhaCungCapSelected,
  setNhaCungCapSelected,
  typeProduct,
  setTypeProduct,
  setIsEnabled,
  isEnabled,
  handleClickSaveBtn,
  listNhaCungCap,
  listTypeProduct,
  ...props
}) {
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
        <SmallTitle>{t("additional_information")}</SmallTitle>

        <p className="mt-4">{t("supplier")}</p>
        <AddChooseSupplierDropdown
          listDropdown={listNhaCungCap}
          textDefault={t("choose_supplier")}
          showing={nhaCungCapSelected}
          setShowing={setNhaCungCapSelected}
        />
        <p className="mt-4">{t("type.typeGoods")}</p>
        <AddChooseTypeDropdown
          listDropdown={listTypeProduct}
          textDefault={t("choose_type")}
          showing={typeProduct}
          setShowing={setTypeProduct}
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
          title="B???n c?? ch???c ch???n mu???n ch???nh s???a s???n ph???m kh??ng?"
          handleClickSaveBtn={handleClickSaveBtn}
        >
          {t("save_product")}
        </ConfirmPopup>
      </div>
    </div>
  )
}

function AdditionUnitRow({
  newType,
  setNewType,
  newDetail,
  setNewDetail,
  handleAddNewUnit,
}) {
  const { t } = useTranslation()
  return (
    <div className="grid items-end gap-2 mt-3 text-white grid-cols-454510 md:gap-5">
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
        onChange={(e) => setNewDetail(e.target.value)}
        type="number"
        value={newDetail}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleAddNewUnit()
          }
        }}
      />
      <div className="h-[46px] flex items-center justify-center">
        <AddUnitIcon className="cursor-pointer" onClick={handleAddNewUnit} />
      </div>
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
