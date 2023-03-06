import React, { useEffect, useState } from "react"
import PrimaryInput from "../../PrimaryInput"
import PrimaryTextArea from "../../PrimaryTextArea"
import SmallTitle from "../../SmallTitle"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import CityDropDown from "../../CityDropDown"
import WardDropDown from "../../WardDropDown"
import DistrictDropDown from "../../DistrictDropDown"
import {
  getListCity,
  getListDistrictByCode,
  getListWardByCode,
} from "../../../apis/search-country-module"
import { addNewSupplier } from "../../../apis/supplier-module"
import ConfirmPopup from "../../ConfirmPopup"
import { emailRegex, phoneRegex } from "../../../constants/constants"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

interface Supplier {
  supplierId: number
  supplierName: string
  supplierPhone: number
  city: any
  district: any
  ward: any
  address: string
  note: number
  supplierEmail: string
  status: boolean
}

function AddSupplier(props) {
  const [supplier, setSupplier] = useState<Supplier>()
  const [isEnabled, setIsEnabled] = useState(true)
  const [disabled, setDisabled] = useState(true)

  const [citySelected, setCitySelected] = useState<any>()
  const [districtSelected, setDistrictSelected] = useState<any>()
  const [wardSelected, setWardSelected] = useState<any>()

  const [listCity, setListCity] = useState([])
  const [listDistrict, setListDistrict] = useState([])
  const [listWard, setListWard] = useState([])

  useQueries([
    {
      queryKey: ["getListCity"],
      queryFn: async () => {
        const response = await getListCity()
        setListCity(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListDistrict", citySelected],
      queryFn: async () => {
        if (citySelected) {
          const response = await getListDistrictByCode(citySelected?.code)
          setListDistrict(response?.data?.districts)
          return response?.data
        }
      },
    },
    {
      queryKey: ["getListWards", districtSelected],
      queryFn: async () => {
        if (districtSelected) {
          const response = await getListWardByCode(districtSelected?.code)
          setListWard(response?.data?.wards)
          return response?.data
        }
      },
    },
  ])

  useEffect(() => {
    setDistrictSelected(undefined)
    setWardSelected(undefined)
    setSupplier({
      ...supplier,
      city: {
        id: citySelected?.code,
        name: citySelected?.name,
      },
    })
  }, [citySelected])
  useEffect(() => {
    setWardSelected(undefined)
    setSupplier({
      ...supplier,
      district: {
        id: districtSelected?.code,
        name: districtSelected?.name,
      },
    })
  }, [districtSelected])
  useEffect(() => {
    setSupplier({
      ...supplier,
      ward: {
        id: wardSelected?.code,
        name: wardSelected?.name,
      },
    })
  }, [wardSelected])

  const router = useRouter()
  const addNewSupplierMutation = useMutation(
    async (newProduct) => {
      return await addNewSupplier(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm nhà cung cấp thành công!")
          router.push("/manage-suppliers")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
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
    setSupplier({
      ...supplier,
      status: true,
    })
  }, [isEnabled])

  const handleAddNewSupplier = () => {
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    addNewSupplierMutation.mutate({
      ...supplier,
    })
  }
  const handleCancelAddNewSupplier = (event) => {
    router.push("/manage-suppliers")
  }

  useEffect(() => {
    if (
      emailRegex.test(supplier?.supplierEmail) &&
      supplier?.supplierName.trim() !== "" &&
      phoneRegex.test(supplier?.supplierPhone.toString())
    ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  })
  console.log(supplier)
  return (
    <div className="">
      <div>
        <div className="bg-white block-border w-full">
          <SmallTitle>Thông tin chung</SmallTitle>
          <PrimaryInput
            className="mt-6"
            placeholder="Nhập tên nhà cung cấp"
            title={
              <h1>
                Tên nhà cung cấp <span className="text-red-500">*</span>
              </h1>
            }
            onChange={(e) => {
              setSupplier({ ...supplier, supplierName: e.target.value })
            }}
          />
          <div className="grid grid-cols-2 mt-4 gap-7">
            <PrimaryInput
              placeholder="Nhập số điện thoại"
              title={
                <div className="flex gap-1">
                  <h1>
                    Số điện thoại <span className="text-red-500">*</span>
                  </h1>
                </div>
              }
              onChange={(e) => {
                setSupplier({ ...supplier, supplierPhone: e.target.value })
              }}
            />
            <PrimaryInput
              title="Email"
              placeholder="Nhập tên tài khoản gmail"
              onChange={(e) => {
                setSupplier({ ...supplier, supplierEmail: e.target.value })
              }}
            />
          </div>

          <div className="grid grid-cols-3 mt-4 gap-7">
            <CityDropDown
              title={
                <div className="flex gap-1">
                  <h1>
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </h1>
                </div>
              }
              listDropdown={listCity}
              textDefault={"Chọn Tỉnh/Thành phố"}
              showing={citySelected}
              setShowing={setCitySelected}
            />
            <DistrictDropDown
              title={
                <div className="flex gap-1">
                  <h1>
                    Quận/Huyện <span className="text-red-500">*</span>
                  </h1>
                </div>
              }
              listDropdown={listDistrict}
              textDefault={"Chọn Quận/Huyện"}
              showing={districtSelected}
              setShowing={setDistrictSelected}
            />
            <WardDropDown
              title={
                <div className="flex gap-1">
                  <h1>
                    Phường/Xã <span className="text-red-500">*</span>
                  </h1>
                </div>
              }
              listDropdown={listWard}
              textDefault={"Chọn Phường/Xã"}
              showing={wardSelected}
              setShowing={setWardSelected}
            />
          </div>
          <PrimaryInput
            className="mt-4"
            title="Địa chỉ chi tiết"
            placeholder="Địa chỉ chi tiếp như số nhà, ngõ, đường"
            onChange={(e) => {
              setSupplier({ ...supplier, address: e.target.value })
            }}
          />
          <PrimaryTextArea
            className="mt-4"
            title="Ghi chú nhà cung cấp"
            onChange={(e) => {
              setSupplier({ ...supplier, note: e.target.value })
            }}
          />
          <div className="flex items-center absolute-right mt-6">
            <div className="flex flex-col gap-4">
              <div className="grid items-center justify-between fle w-full gap-4 md:grid-cols-2 ">
                <ConfirmPopup
                  classNameBtn="bg-cancelBtn border-cancelBtn active:bg-cancelDark w-52"
                  title="Bạn có chắc chắn muốn hủy thêm nhà cung cấp không?"
                  handleClickSaveBtn={handleCancelAddNewSupplier}
                >
                  Hủy
                </ConfirmPopup>

                <ConfirmPopup
                  classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
                  title="Bạn có chắc chắn muốn thêm nhà cung cấp không?"
                  handleClickSaveBtn={handleAddNewSupplier}
                  disabled={disabled}
                >
                  Thêm nhà cung cấp
                </ConfirmPopup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddSupplier
