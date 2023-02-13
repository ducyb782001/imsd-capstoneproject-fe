import React, { useEffect, useState } from "react"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import PrimaryBtn from "../PrimaryBtn"
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

function AddSupplier(props) {
  const [product, setProduct] = useState<Product>()
  const [listUnits, setListUnits] = useState([])
  const [imageUploaded, setImageUploaded] = useState("")
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeProduct, setTypeProduct] = useState<any>()
  const [isEnabled, setIsEnabled] = useState(true)

  const listNhaCungCapDemo = [
    { id: "1", name: "Chinh Bac" },
    { id: "2", name: "ABCD" },
  ]
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
          toast.success("Thêm nhà cung cấp thành công!")
          router.push("/manage-suppliers")
        } else {
          console.log(data)
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Đã có lỗi xảy ra! Xin kiểm tra lại",
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
        <div className="bg-white block-border w-full">
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
          <div className="flex items-center absolute-right">
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

export default AddSupplier
