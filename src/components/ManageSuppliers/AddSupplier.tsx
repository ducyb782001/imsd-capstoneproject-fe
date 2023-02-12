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
import SecondaryBtn from "../SecondaryBtn"
import AddPlusIcon from "../icons/AddPlusIcon"
import GarbageIcon from "../icons/GarbageIcon"
import AddUnitIcon from "../icons/AddUnitIcon"
import ReadOnlyField from "../ReadOnlyField"
import { IKImage, IKUpload } from "imagekitio-react"
import AddImage from "../AddImage"
import Loading from "../Loading"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { addNewProduct } from "../../apis/product-module"
import ChooseSupplierDropdown from "../ManageGoods/ChooseSupplierDropdown"
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

  const listNhaCungCapDemo = [
    { id: "1", name: "Chinh Bac" },
    { id: "2", name: "ABCD" },
  ]

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
        supplierId: nhaCungCapSelected.id,
      })
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (typeProduct) {
      setProduct({
        ...product,
        categoryId: typeProduct.id,
      })
    }
  }, [typeProduct])

  const router = useRouter()
  const addNewProductMutation = useMutation(
    async (newProduct) => {
      return await addNewProduct(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Add new product success")
          router.push("/coupon")
        } else {
          console.log(data)
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
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

  console.log(
    "Product: ",
    product,
    "Image url: ",
    imageUploaded,
    "Nha cung cap: ",
    product?.supplierId,
    "Loai: ",
    product?.measuredUnits,
  )
  return (
    <div className="">
      <div>
        <div className="bg-white block-border">
          <SmallTitle>Thông tin chung</SmallTitle>
          <PrimaryInput
            className="mt-6"
            placeholder="Nhập tên nhà cung cấp"
            title={
              <p>
                Tên nhà cung cấp <span className="text-red-500">*</span>
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
                  <p>
                    Số điện thoại <span className="text-red-500">*</span>
                  </p>
                </div>
              }
              onChange={(e) => {
                setProduct({ ...product, productCode: e.target.value })
              }}
            />
            <PrimaryInput
              title="Email"
              onChange={(e) => {
                setProduct({ ...product, defaultMeasuredUnit: e.target.value })
              }}
            />
          </div>

          <div className="grid grid-cols-3 mt-4 gap-7">
            <ChooseSupplierDropdown
              title={"Tỉnh/Thành phố"}
              listDropdown={listNhaCungCapDemo}
              textDefault={"Chọn Tỉnh/Thành phố"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
            <ChooseSupplierDropdown
              title={"Quận/Huyện/Thành phố"}
              listDropdown={listNhaCungCapDemo}
              textDefault={"Chọn Quận/Huyện/Thành phố"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
            <ChooseSupplierDropdown
              title={"Phường/Xã"}
              listDropdown={listNhaCungCapDemo}
              textDefault={"Chọn Phường/Xã"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
          </div>
          <PrimaryInput
            className="mt-4"
            title="Địa chỉ chi tiết"
            onChange={(e) => {
              setProduct({ ...product, defaultMeasuredUnit: e.target.value })
            }}
          />
          <PrimaryTextArea
            className="mt-4"
            title="Ghi chú nhà cung cấp"
            onChange={(e) => {
              setProduct({ ...product, description: e.target.value })
            }}
          />
        </div>

        <div className="mt-4 h-24 bg-white block-border ">
          <div className="flex items-center float-right">
            <div className="flex flex-col gap-4">
              <div className="grid items-center justify-between fle w-full gap-4 md:grid-cols-2 ">
                <PrimaryBtn className="bg-cancelBtn border-cancelBtn active:bg-cancelDark">
                  Hủy
                </PrimaryBtn>
                <PrimaryBtn className="bg-successBtn border-successBtn active:bg-greenDark">
                  Thêm nhà cung cấp
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
