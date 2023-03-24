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
  note: number
  supplierEmail: string
  status: boolean
}

function AddSupplier() {
  const { t } = useTranslation()
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
          toast.success(t("add_supplier_success"))
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

  const handleAddNewSupplier = () => {
    toast.loading(t("operation_process"), {
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
  return (
    <div className="">
      <div>
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
            onChange={(e) => {
              setSupplier({ ...supplier, supplierName: e.target.value })
            }}
          />
          <div className="grid grid-cols-2 mt-4 gap-7">
            <PrimaryInput
              placeholder={t("enter_number")}
              title={
                <div className="flex gap-1">
                  <h1>
                    {t("phone_number")} <span className="text-red-500">*</span>
                  </h1>
                </div>
              }
              onChange={(e) => {
                setSupplier({ ...supplier, supplierPhone: e.target.value })
              }}
            />
            <PrimaryInput
              title="Email"
              placeholder={t("enter_email")}
              onChange={(e) => {
                setSupplier({ ...supplier, supplierEmail: e.target.value })
              }}
            />
          </div>

          <div className="grid grid-cols-1 mt-4 md:grid-cols-3 gap-x-7 gap-y-4">
            <CityDropDown
              title={
                <div className="flex gap-1">
                  <h1>{t("city")}</h1>
                </div>
              }
              listDropdown={listCity}
              textDefault={t("choose_city")}
              showing={citySelected}
              setShowing={setCitySelected}
            />
            <DistrictDropDown
              title={
                <div className="flex gap-1">
                  <h1>{t("district")}</h1>
                </div>
              }
              listDropdown={listDistrict}
              textDefault={t("choose_district")}
              showing={districtSelected}
              setShowing={setDistrictSelected}
            />
            <WardDropDown
              title={t("ward")}
              listDropdown={listWard}
              textDefault={t("choose_ward")}
              showing={wardSelected}
              setShowing={setWardSelected}
            />
          </div>
          <PrimaryInput
            className="mt-4"
            title={t("detail_adderss")}
            placeholder={t("enter_detail_address")}
            onChange={(e) => {
              setSupplier({ ...supplier, address: e.target.value })
            }}
          />
          <PrimaryTextArea
            className="mt-4"
            title={t("note_supplier")}
            onChange={(e) => {
              setSupplier({ ...supplier, note: e.target.value })
            }}
          />
          <div className="flex flex-col items-center justify-end w-full gap-4 mt-6 md:flex-row md:w-1/2">
            <ConfirmPopup
              classNameBtn="bg-cancelBtn border-cancelBtn active:bg-cancelDark"
              title={t("cancel_confirm_supplier")}
              handleClickSaveBtn={handleCancelAddNewSupplier}
            >
              {t("cancel")}
            </ConfirmPopup>

            <ConfirmPopup
              classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
              title={t("add_confirm_supplier")}
              handleClickSaveBtn={handleAddNewSupplier}
              disabled={disabled}
            >
              {t("add_new_supplier")}
            </ConfirmPopup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddSupplier
