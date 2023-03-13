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
import { useTranslation } from "react-i18next"

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
          toast.success(t("update_supplier_success"))
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
                t("error_occur"),
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
    toast.loading(t("operation_process"), {
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
  const { t } = useTranslation()
  return (
    <div className="w-full bg-white block-border">
      <SmallTitle>{t("general_information")}</SmallTitle>
      <PrimaryInput
        className="mt-6"
        placeholder={t("fill_supplier_name")}
        title={
          <h1>
            {t("supplier_name")} <span className="text-red-500">*</span>
          </h1>
        }
        value={supplier?.supplierName}
        onChange={(e) => {
          setSupplier({ ...supplier, supplierName: e.target.value })
        }}
      />
      <div className="grid grid-cols-2 mt-4 gap-7">
        <PrimaryInput
          title={t("phone_number")}
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
          title={t("city")}
          listDropdown={listCity}
          textDefault={supplier?.city?.name}
          showing={citySelected}
          setShowing={setCitySelected}
        />
        <DistrictDropDown
          title={t("district")}
          listDropdown={listDistrict}
          textDefault={supplier?.district?.name}
          showing={districtSelected}
          setShowing={setDistrictSelected}
        />
        <WardDropDown
          title={t("ward")}
          listDropdown={listWard}
          textDefault={supplier?.ward?.name}
          showing={wardSelected}
          setShowing={setWardSelected}
        />
      </div>
      <PrimaryInput
        className="mt-4"
        title={t("detail_adderss")}
        value={supplier?.address}
        onChange={(e) => {
          setSupplier({ ...supplier, address: e.target.value })
        }}
      />
      <PrimaryTextArea
        className="mt-4"
        title={t("note_supplier")}
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
              title={t("cancel_update_supplier")}
              handleClickSaveBtn={handleCancelEditSupplier}
            >
              {t("cancel")}
            </ConfirmPopup>

            <ConfirmPopup
              classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
              title={t("confirm_update_spplier")}
              handleClickSaveBtn={handleEditSupplier}
              disabled={disabled}
            >
              {t("edit")}
            </ConfirmPopup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditSupplier
