import React, { useEffect, useState } from "react"
import InfoIcon from "../icons/InfoIcon"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import Switch from "react-switch"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../../lib/constants"
import Tooltip from "../ToolTip"
import DemoDropDown from "../DemoDropDown"
import PrimaryBtn from "../PrimaryBtn"
import ChooseSupplierDropdown from "./ChooseSupplierDropdown"
import ChooseTypeDropdown from "./ChooseTypeDropdown"
import SecondaryBtn from "../SecondaryBtn"
import AddPlusIcon from "../icons/AddPlusIcon"
import GarbageIcon from "../icons/GarbageIcon"
import AddUnitIcon from "../icons/AddUnitIcon"
import ReadOnlyField from "../ReadOnlyField"
import { IKImage, IKUpload } from "imagekitio-react"
import AddImage from "../AddImage"
import Loading from "../Loading"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { addNewProduct } from "../../apis/product-module"
import {
  getListExportTypeGood,
  getListTypeGood,
} from "../../apis/type-good-module"
import { getListExportSupplier } from "../../apis/supplier-module"

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
}

function AddProduct(props) {
  const [queryParams, setQueryParams] = useState<any>({})
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
        const response = await getListExportSupplier({})
        await setListNhaCungCap(response?.data?.data)
        return response?.data
      },
    },
  ])

  const router = useRouter()
  const addNewProductMutation = useMutation(
    async (newProduct) => {
      return await addNewProduct(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Thêm mới sản phẩm thành công")
          router.push("/manage-goods")
        } else {
          console.log(data)
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Đã có lỗi xảy ra! Xin hãy thử lại.",
            )
          }
        }
      },
    },
  )

  useEffect(() => {
    setProduct({
      ...product,
      status: true,
    })
  }, [isEnabled])

  const handleAddNewProduct = (event) => {
    event.preventDefault()
    // @ts-ignore
    addNewProductMutation.mutate({
      ...product,
    })
  }

  console.log("Product: ", product)
  return (
    <div className="grid gap-4 md:grid-cols-73">
      <div>
        <div className="bg-white block-border">
          <SmallTitle>Thông tin chung</SmallTitle>
          <PrimaryInput
            className="mt-6"
            title={
              <p>
                Tên sản phẩm <span className="text-red-500">*</span>
              </p>
            }
            onChange={(e) => {
              setProduct({ ...product, productName: e.target.value })
            }}
          />
          <div className="grid grid-cols-2 mt-4 gap-7">
            <PrimaryInput
              title={
                <div className="flex gap-1">
                  <p>Mã sản phẩm</p>
                  <Tooltip
                    content={
                      <div>
                        Mã không trùng lặp giữa các sản phẩm
                        <p>Nếu để trống, mã sản phẩm sẽ có tiền tố SP</p>
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
              title="Đơn vị tính"
              onChange={(e) => {
                setProduct({ ...product, defaultMeasuredUnit: e.target.value })
              }}
            />
            <PrimaryInput
              title="Giá nhập"
              type="number"
              onChange={(e) => {
                setProduct({ ...product, costPrice: e.target.value })
              }}
            />
            <PrimaryInput
              title="Giá bán"
              type="number"
              onChange={(e) => {
                setProduct({ ...product, sellingPrice: e.target.value })
              }}
            />
          </div>
          <PrimaryTextArea
            title="Ghi chú sản phẩm"
            onChange={(e) => {
              setProduct({ ...product, description: e.target.value })
            }}
          />
        </div>
        <div className="mt-4 bg-white block-border">
          <div className="flex items-center gap-2">
            <SmallTitle>Khởi tạo kho hàng</SmallTitle>
            <Tooltip
              content={<div>Khởi tạo số lượng hàng sẵn có trong kho.</div>}
            >
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
                    title="Tồn kho ban đầu"
                    type="number"
                    onChange={(e) => {
                      setProduct({ ...product, inStock: e.target.value })
                    }}
                  />
                  <PrimaryInput
                    title="Giá nhập"
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
            <SmallTitle>Thêm đơn vị quy đổi</SmallTitle>
            <Tooltip
              content={
                <div>
                  Tạo thêm các đơn vị để quản lí sản phẩm.
                  <p>Ví dụ: 1 thùng = 10 chai</p>
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
        setNhaCungCapSelected={setNhaCungCapSelected}
        typeProduct={typeProduct}
        setTypeProduct={setTypeProduct}
        handleAddProduct={handleAddNewProduct}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        listNhaCungCap={listNhaCungCap}
        listTypeProduct={listTypeProduct}
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
  setNhaCungCapSelected,
  typeProduct,
  setTypeProduct,
  handleAddProduct,
  isEnabled,
  setIsEnabled,
  listNhaCungCap,
  listTypeProduct,
}) {
  const [loadingImage, setLoadingImage] = useState(false)
  const [disabled, setDisabled] = useState(true)

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

  return (
    <div className="">
      <div className="bg-white block-border h-[365px] flex flex-col items-center justify-center gap-4">
        <p className="mb-5 text-xl font-semibold">Ảnh sản phẩm</p>
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
                  <Loading />
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
        <SmallTitle>
          Thông tin bổ sung <span className="text-red-500">*</span>
        </SmallTitle>

        <p className="mt-4">Nhà cung cấp</p>
        <ChooseSupplierDropdown
          listDropdown={listNhaCungCap}
          textDefault={"Chọn nhà cung cấp"}
          showing={nhaCungCapSelected}
          setShowing={setNhaCungCapSelected}
        />
        <p className="mt-4">Loại sản phẩm</p>
        <ChooseTypeDropdown
          listDropdown={listTypeProduct}
          textDefault={"Chọn loại sản phẩm"}
          showing={typeProduct}
          setShowing={setTypeProduct}
        />
        <p className="mt-4">Trạng thái</p>
        <div className="flex items-center justify-between">
          <p className="text-gray">Cho phép bán</p>
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
        {/* <PrimaryBtn className="bg-cancelBtn border-cancelBtn active:bg-cancelDark">
          Hủy
        </PrimaryBtn>
        <PrimaryBtn className="bg-successBtn border-successBtn active:bg-greenDark">
          Thêm sản phẩm
        </PrimaryBtn> */}
        <PrimaryBtn
          className="bg-successBtn border-successBtn active:bg-greenDark"
          onClick={handleAddProduct}
          disabled={disabled}
        >
          Thêm sản phẩm
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
  return (
    <div className="grid items-end gap-2 mt-3 text-white grid-cols-454510 md:gap-5">
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="Thùng"
        title="Đơn vị quy đổi"
        onChange={(e) => setNewType(e.target.value)}
        value={newType}
      />
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="10"
        title="Số lượng trong đơn vị tương ứng"
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

  return (
    <div className="grid items-end gap-2 mt-3 text-white grid-cols-454510 md:gap-5">
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="Thùng"
        title="Đơn vị quy đổi"
        value={data?.measuredUnitName}
        readOnly
      />
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="10"
        title="Số lượng trong đơn vị tương ứng"
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
