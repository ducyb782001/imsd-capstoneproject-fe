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
import {
  getSupplierDetail,
  updateSupplier,
} from "../../../apis/supplier-module"
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
  note: string
  supplierEmail: string
  status: boolean
}

function EditSupplier(props) {
  const [supplier, setSupplier] = useState<Supplier>()
  const [isEnabled, setIsEnabled] = useState(true)
  const [disabled, setDisabled] = useState(true)

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
        const response = await getListDistrictByCode(citySelected?.id)
        setListDistrict(response?.data?.districts)
        return response?.data
      },
    },
    {
      queryKey: ["getListWards", districtSelected],
      queryFn: async () => {
        const response = await getListWardByCode(districtSelected?.id)
        setListWard(response?.data?.wards)
        return response?.data
      },
    },
  ])
  console.log(supplier)
  useEffect(() => {
    setDistrictSelected(undefined)
    setWardSelected(undefined)
    setSupplier({
      ...supplier,
      city: {
        id: citySelected?.id,
        name: citySelected?.name,
      },
    })
  }, [citySelected])
  useEffect(() => {
    setWardSelected(undefined)
    setSupplier({
      ...supplier,
      district: {
        id: districtSelected?.id,
        name: districtSelected?.name,
      },
    })
  }, [districtSelected])
  useEffect(() => {
    setSupplier({
      ...supplier,
      ward: {
        id: wardSelected?.id,
        name: wardSelected?.name,
      },
    })
  }, [wardSelected])

  const editSupplierMutation = useMutation(
    async (edittedSupplier) => {
      return await updateSupplier(edittedSupplier)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Cập nhật nhà cung cấp thành công!")
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

  const handleEditSupplier = () => {
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    editSupplierMutation.mutate({
      ...supplier,
    })
  }
  const handleCancelEditSupplier = (event) => {
    router.push("/manage-suppliers")
  }

  useEffect(() => {
    if (
      emailRegex.test(supplier?.supplierEmail) &&
      supplier.supplierName.trim() !== "" &&
      phoneRegex.test(supplier.supplierPhone.toString()) &&
      districtSelected != undefined &&
      citySelected != undefined &&
      wardSelected != undefined
    ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  })

  return (
    <div className="w-full bg-white block-border">
      <SmallTitle>Thông tin chung</SmallTitle>
      <PrimaryInput
        className="mt-6"
        placeholder="Nhập tên nhà cung cấp"
        title={
          <h1>
            Tên nhà cung cấp <span className="text-red-500">*</span>
          </h1>
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
              <h1>
                Số điện thoại <span className="text-red-500">*</span>
              </h1>
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
          textDefault={supplier?.city?.name}
          showing={citySelected}
          setShowing={setCitySelected}
        />
        <DistrictDropDown
          title={"Quận/Huyện"}
          listDropdown={listDistrict}
          textDefault={supplier?.district?.name}
          showing={districtSelected}
          setShowing={setDistrictSelected}
        />
        <WardDropDown
          title={"Phường/Xã"}
          listDropdown={listWard}
          textDefault={supplier?.ward?.name}
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
      <div className="flex items-center mt-6 absolute-right">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full gap-4 fle md:grid-cols-4 ">
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
              disabled={disabled}
            >
              Chỉnh sửa
            </ConfirmPopup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditSupplier
