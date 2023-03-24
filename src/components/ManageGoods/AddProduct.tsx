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
import { IKImage } from "imagekitio-react"
import AddImage from "../AddImage"
import Loading from "../Loading"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { addNewProduct } from "../../apis/product-module"
import { getListExportTypeGood } from "../../apis/type-good-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import AddChooseSupplierDropdown from "./AddChooseSupplierDropdown"
import AddChooseTypeDropdown from "./AddChooseTypeDropdown"
import { useTranslation } from "react-i18next"

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
  const [imageUploaded, setImageUploaded] = useState("")
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
    if (imageUploaded) {
      setProduct({
        ...product,
        image: imageUploaded,
      })
    }
  }, [imageUploaded])

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
        const response = await getListExportSupplier({})
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

  const handleAddNewProduct = (event) => {
    event.preventDefault()
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
          <SmallTitle>{t("general_information")}</SmallTitle>
          <PrimaryInput
            className="mt-6"
            title={
              <p>
                {t("product_name")} <span className="text-red-500">*</span>
              </p>
            }
            onChange={(e) => {
              setProduct({ ...product, productName: e.target.value })
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
            <PrimaryInput
              title="Mã barcode"
              onChange={(e) => {
                setProduct({ ...product, barcode: e.target.value })
              }}
            />
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
              onChange={(e) => {
                setProduct({ ...product, costPrice: e.target.value })
              }}
              accessoriesRight="đ"
            />
            <PrimaryInput
              title={t("sell_price")}
              type="number"
              accessoriesRight="đ"
              onChange={(e) => {
                setProduct({ ...product, sellingPrice: e.target.value })
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
                    onChange={(e) => {
                      setProduct({ ...product, inStock: e.target.value })
                    }}
                  />
                  <PrimaryInput
                    title={t("cost_price")}
                    type="number"
                    onChange={(e) => {
                      setProduct({ ...product, stockPrice: e.target.value })
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
        imageUploaded={imageUploaded}
        setImageUploaded={setImageUploaded}
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
  imageUploaded,
  setImageUploaded,
  nhaCungCapSelected,
  typeProduct,
  handleAddProduct,
  isEnabled,
  setIsEnabled,
}) {
  const [disabled, setDisabled] = useState(true)
  const [loadingImage, setLoadingImage] = useState(false)

  const onErrorUpload = (error: any) => {
    console.log("Run upload error", error)
    setLoadingImage(false)
  }

  const onSuccessUpload = (res: any) => {
    // setImages([...images, res.filePath])
    console.log("Run onsucces here")
    setImageUploaded(res.url)
    setLoadingImage(false)
  }

  useEffect(() => {
    if (
      nhaCungCapSelected == null ||
      typeProduct == null ||
      product.productName?.trim() == "" ||
      product.productName == null
    ) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  })
  const { t } = useTranslation()
  return (
    <div className="">
      <div className="bg-white block-border h-[365px] flex flex-col items-center justify-center gap-4">
        <p className="mt-4 text-xl font-semibold">{t("image_product")}</p>

        <div className="flex justify-center md:justify-start">
          <div className="flex items-center justify-center border rounded-2xl border-primary w-[150px] h-[150px] mt-5">
            <AddImage
              onError={onErrorUpload}
              onSuccess={onSuccessUpload}
              imageUploaded={imageUploaded}
              setLoadingImage={setLoadingImage}
            >
              {loadingImage ? (
                <div className="w-full h-[176px] flex items-center justify-center">
                  <Loading />
                </div>
              ) : imageUploaded ? (
                <IKImage src={imageUploaded} />
              ) : (
                ""
              )}
            </AddImage>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>{t("additional_information")}</SmallTitle>
        <div className="mt-4 mb-2 text-sm font-bold text-gray">Ngưỡng tồn</div>
        <div className="flex items-center w-full gap-2">
          <PrimaryInput
            placeholder="Min"
            type="number"
            onChange={(e) => {
              setProduct({ ...product, minStock: e.target.value })
            }}
          />
          <p>-</p>
          <PrimaryInput
            placeholder="Max"
            type="number"
            onChange={(e) => {
              setProduct({ ...product, maxStock: e.target.value })
            }}
          />
        </div>

        <PrimaryTextArea
          rows={4}
          className="mt-5"
          title={t("note_product")}
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
        <PrimaryBtn
          className="bg-successBtn border-successBtn active:bg-greenDark"
          onClick={handleAddProduct}
          disabled={disabled}
        >
          {t("add_product")}
        </PrimaryBtn>
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
          // 13 is enter button
          console.log("E: ", e)

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
