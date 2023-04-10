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
  getAllProvinces,
  getListDistrictByCode,
  getListWardByCode,
} from "../../../apis/search-country-module"
import { addNewSupplier } from "../../../apis/supplier-module"
import ConfirmPopup from "../../ConfirmPopup"
import { useTranslation } from "react-i18next"
import { isValidGmail, isValidPhoneNumber } from "../../../hooks/useValidator"
import GeneralIcon from "../../icons/GeneralIcon"
import { checkStringLength } from "../../../lib"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created- product-type-id"

interface Supplier {
  supplierId: number
  supplierName: string
  supplierPhone: string
  city: any
  district: any
  ward: any
  address: string
  note: string
  supplierEmail: string
  status: boolean
}

function AddSupplier() {
  const { t } = useTranslation()
  const [supplier, setSupplier] = useState<Supplier>()
  const [isEnabled, setIsEnabled] = useState(true)
  const [disabled, setDisabled] = useState(false)

  const [citySelected, setCitySelected] = useState<any>()
  const [districtSelected, setDistrictSelected] = useState<any>()
  const [wardSelected, setWardSelected] = useState<any>()

  const [listCity, setListCity] = useState<any>()
  const [listDistrict, setListDistrict] = useState<any>()
  const [listWard, setListWard] = useState<any>()

  useQueries([
    {
      queryKey: ["getAllProvinces"],
      queryFn: async () => {
        const response = await getAllProvinces()
        setListCity(response?.data?.data?.data)

        return response?.data?.data
      },
    },
    {
      queryKey: ["getListDistrict", citySelected],
      queryFn: async () => {
        if (citySelected) {
          const response = await getListDistrictByCode(citySelected?.code)
          setListDistrict(response?.data?.data?.data)
          return response?.data?.data
        }
      },
      enabled: !!citySelected,
    },
    {
      queryKey: ["getListWards", districtSelected],
      queryFn: async () => {
        if (districtSelected) {
          const response = await getListWardByCode(districtSelected?.code)
          setListWard(response?.data?.data?.data)

          return response?.data?.data
        }
      },
      enabled: !!districtSelected,
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
          setDisabled(false)
          router.push("/manage-suppliers")
        } else {
          setDisabled(false)
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
    setDisabled(true)

    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    addNewSupplierMutation.mutate({
      ...supplier,
    })
  }

  return (
    <div className="">
      <div>
        <div className="w-full bg-white block-border">
          <div className="flex gap-3 item-center">
            <GeneralIcon />
            <SmallTitle>{t("general_information")}</SmallTitle>
          </div>
          <div className="mt-6">
            <PrimaryInput
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
            {checkStringLength(supplier?.supplierName, 100) && (
              <div className="text-sm text-red-500">
                {t("max_supplier_number")}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 mt-4 gap-7">
            <div>
              <PrimaryInput
                placeholder={t("enter_number")}
                title={
                  <div className="flex gap-1">
                    <h1>
                      {t("phone_number")}{" "}
                      <span className="text-red-500">*</span>
                    </h1>
                  </div>
                }
                onChange={(e) => {
                  setSupplier({ ...supplier, supplierPhone: e.target.value })
                }}
              />
              {supplier?.supplierPhone &&
                !!!isValidPhoneNumber(supplier?.supplierPhone) && (
                  <p className="text-red-500">{t("wrong_valid")}</p>
                )}
            </div>
            <div>
              <PrimaryInput
                title="Email"
                placeholder={t("enter_email")}
                onChange={(e) => {
                  setSupplier({ ...supplier, supplierEmail: e.target.value })
                }}
              />
              {supplier?.supplierEmail &&
                !!!isValidGmail(supplier?.supplierEmail) && (
                  <p className="text-red-500">{t("wrong_valid")}</p>
                )}
            </div>
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
          <div>
            <PrimaryInput
              className="mt-4"
              title={t("detail_adderss")}
              placeholder={t("enter_detail_address")}
              onChange={(e) => {
                setSupplier({ ...supplier, address: e.target.value })
              }}
            />
            {checkStringLength(supplier?.address, 250) && (
              <div className="text-sm text-red-500">
                {t("max_address_length")}
              </div>
            )}
          </div>
          <div>
            <PrimaryTextArea
              className="mt-4"
              title={t("note_supplier")}
              onChange={(e) => {
                setSupplier({ ...supplier, note: e.target.value })
              }}
            />
            {checkStringLength(supplier?.note, 250) && (
              <div className="text-sm text-red-500">{t("note_warning")}</div>
            )}
          </div>
          <div className="flex flex-col items-center justify-end w-full gap-4 mt-6 md:flex-row">
            <ConfirmPopup
              className="md:w-[200px]"
              classNameBtn="bg-cancelBtn border-cancelBtn active:bg-cancelDark"
              title={t("cancel_confirm_supplier")}
              handleClickSaveBtn={() => router.push("/manage-suppliers")}
            >
              {t("cancel")}
            </ConfirmPopup>

            <ConfirmPopup
              classNameBtn="bg-successBtn border-successBtn active:bg-greenDark md:w-[200px]"
              title={t("add_confirm_supplier")}
              handleClickSaveBtn={handleAddNewSupplier}
              disabled={
                disabled ||
                (supplier?.supplierPhone &&
                  !!!isValidPhoneNumber(supplier?.supplierPhone)) ||
                (supplier?.supplierEmail &&
                  !!!isValidGmail(supplier?.supplierEmail)) ||
                !!!supplier?.supplierPhone ||
                !!!supplier?.supplierName ||
                supplier?.supplierName?.length > 100 ||
                supplier?.note?.length > 250 ||
                supplier?.address?.length > 250
              }
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
