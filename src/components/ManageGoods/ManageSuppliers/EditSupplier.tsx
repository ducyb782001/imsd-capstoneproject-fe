import React, { useEffect, useState } from "react"
import PrimaryInput from "../../PrimaryInput"
import PrimaryTextArea from "../../PrimaryTextArea"
import SmallTitle from "../../SmallTitle"
import PrimaryBtn from "../../PrimaryBtn"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { addNewProduct } from "../../../apis/product-module"
import CityDropDown from "../../CityDropDown"
import WardDropDown from "../../WardDropDown"
import DistrictDropDown from "../../DistrictDropDown"
import {
  getListCity,
  getListDistrictByCode,
  getListWardByCode,
} from "../../../apis/search-country-module"
import {
  addNewSupplier,
  getSupplierDetail,
  updateSupplier,
} from "../../../apis/supplier-module"
import ConfirmPopup from "../../ConfirmPopup"

interface Supplier {
  supplierId: number
  supplierName: string
  supplierPhone: number
  city: string
  district: string
  ward: string
  address: string
  note: string
  supplierEmail: string
  status: boolean
}

function EditSupplier(props) {
  const [supplier, setSupplier] = useState<Supplier>()
  const [isEnabled, setIsEnabled] = useState(true)

  const [citySelected, setCitySelected] = useState<any>()
  const [districtSelected, setDistrictSelected] = useState<any>()
  const [wardSelected, setWardSelected] = useState<any>()

  const [listCity, setListCity] = useState([])
  const [listDistrict, setListDistrict] = useState([])
  const [listWard, setListWard] = useState([])
  const [isAddressChanged, setIsAddressChanged] = useState(false)

  const router = useRouter()
  const { supplierId } = router.query

  useQueries([
    {
      queryKey: ["getSupplierDetail", supplierId],
      queryFn: async () => {
        if (supplierId) {
          const response = await getSupplierDetail(supplierId)
          setSupplier(response?.data)
          return response?.data
        }
      },
    },
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
        const response = await getListDistrictByCode(citySelected?.code)
        setListDistrict(response?.data?.districts)
        return response?.data
      },
    },
    {
      queryKey: ["getListWards", districtSelected],
      queryFn: async () => {
        const response = await getListWardByCode(districtSelected?.code)
        setListWard(response?.data?.wards)
        return response?.data
      },
    },
  ])

  useEffect(() => {
    setDistrictSelected(undefined)
    setWardSelected(undefined)
    setSupplier({
      ...supplier,
      city: citySelected?.name,
    })
  }, [citySelected])
  useEffect(() => {
    setWardSelected(undefined)
    setSupplier({
      ...supplier,
      district: districtSelected?.name,
    })
  }, [districtSelected])
  useEffect(() => {
    setSupplier({
      ...supplier,
      ward: wardSelected?.name,
    })
  }, [wardSelected])

  const editSupplierMutation = useMutation(
    async (edittedSupplier) => {
      return await updateSupplier(edittedSupplier)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Cập nhật nhà cung cấp thành công!")
          router.push("/manage-suppliers")
        } else {
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
    setSupplier({
      ...supplier,
      status: true,
    })
  }, [isEnabled])

  const handleEditSupplier = () => {
    // @ts-ignore
    editSupplierMutation.mutate({
      ...supplier,
    })
  }
  const handleCancelEditSupplier = (event) => {
    router.push("/manage-suppliers")
  }

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
            value={supplier?.supplierName}
            onChange={(e) => {
              setSupplier({ ...supplier, supplierName: e.target.value })
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
              value={supplier?.supplierPhone}
              onChange={(e) => {
                setSupplier({ ...supplier, supplierPhone: e.target.value })
              }}
            />
            <PrimaryInput
              title="Email"
              value={supplier?.supplierEmail}
              onChange={(e) => {
                setSupplier({ ...supplier, supplierEmail: e.target.value })
              }}
            />
          </div>

          <div className="grid grid-cols-3 mt-4 gap-7">
            <CityDropDown
              title={"Tỉnh/Thành phố"}
              listDropdown={listCity}
              textDefault={supplier?.city}
              showing={citySelected}
              setShowing={setCitySelected}
            />
            <DistrictDropDown
              title={"Quận/Huyện"}
              listDropdown={listDistrict}
              textDefault={supplier?.district}
              showing={districtSelected}
              setShowing={setDistrictSelected}
            />
            <WardDropDown
              title={"Phường/Xã"}
              listDropdown={listWard}
              textDefault={supplier?.ward}
              showing={wardSelected}
              setShowing={setWardSelected}
            />
          </div>
          <PrimaryInput
            className="mt-4"
            title="Địa chỉ chi tiết"
            value={supplier?.address}
            onChange={(e) => {
              setSupplier({ ...supplier, address: e.target.value })
            }}
          />
          <PrimaryTextArea
            className="mt-4"
            title="Ghi chú nhà cung cấp"
            value={supplier?.note}
            onChange={(e) => {
              setSupplier({ ...supplier, note: e.target.value })
            }}
          />
          <div className="flex items-center absolute-right mt-6">
            <div className="flex flex-col gap-4">
              <div className="grid items-center justify-between fle w-full gap-4 md:grid-cols-4 ">
                <ConfirmPopup
                  classNameBtn="bg-cancelBtn border-cancelBtn active:bg-cancelDark w-52"
                  title="Bạn có chắc chắn muốn hủy chỉnh sửa nhà cung cấp không?"
                  handleClickSaveBtn={handleCancelEditSupplier}
                >
                  Hủy
                </ConfirmPopup>

                <ConfirmPopup
                  classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
                  title="Bạn có chắc chắn muốn chỉnh sửa nhà cung cấp không?"
                  handleClickSaveBtn={handleEditSupplier}
                >
                  Chỉnh sửa
                </ConfirmPopup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditSupplier
