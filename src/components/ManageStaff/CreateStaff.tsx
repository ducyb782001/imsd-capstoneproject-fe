import React, { useEffect, useState } from "react"
import Loading from "../Loading"
import PasswordInput from "../PasswordInput"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import SelectGenderDropdown from "../Profile/SelectGenderDropdown"
import SelectRoleDropdown from "../Profile/SelectRoleDropdown"
import Tooltip from "../ToolTip"
import InfoIcon from "../icons/InfoIcon"
import ConfirmPopup from "../ConfirmPopup"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createStaff, getAllStaff } from "../../apis/user-module"
import router from "next/router"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { checkPassword } from "../../lib/check-password"
import { isValidFullName, isValidPhoneNumber } from "../../hooks/useValidator"
import { checkSameUserCode, checkStringLength } from "../../lib"
import useDebounce from "../../hooks/useDebounce"
import UploadImage from "../UploadImage"
import useUploadImage from "../../hooks/useUploadImage"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function CreateStaff() {
  const { t } = useTranslation()
  const [gender, setGender] = useState<any>()
  const [staffAccountObject, setStaffAccountObject] = useState<any>()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [selectRole, setSelectRole] = useState({
    id: 3,
    value: t("seller"),
  })

  useEffect(() => {
    if (gender) {
      setStaffAccountObject({
        ...staffAccountObject,
        gender: gender?.id,
      })
    }
  }, [gender])

  useEffect(() => {
    if (selectRole) {
      setStaffAccountObject({
        ...staffAccountObject,
        roleId: selectRole.id,
      })
    }
  }, [selectRole])

  const createStaffMutation = useMutation(
    async (importProduct) => {
      return await createStaff(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("add_staff_success"))
          router.push("/manage-staff")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data || t("error_occur"))
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

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()

    const submittedData = { userId: 0, status: true, ...staffAccountObject }
    if (!staffAccountObject?.roleId) {
      submittedData["roleId"] = 3
    }
    if (!staffAccountObject?.password) {
      submittedData["password"] = "123456aA"
    }
    if (staffAccountObject?.gender === undefined) {
      submittedData["gender"] = true
    }

    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    createStaffMutation.mutate({ ...staffAccountObject })
  }
  const handleOut = (event) => {
    router.push("/manage-staff")
  }
  const canChangePassword = checkPassword(staffAccountObject?.password)

  const userCodeCheck = useDebounce(staffAccountObject?.userCode, 300)
  const [isLoadingCheck, setIsLoadingCheck] = useState(false)
  const [isSameUserCode, setIsSameUserCode] = useState(false)

  useQueries([
    {
      queryKey: ["getListStaffs", userCodeCheck],
      queryFn: async () => {
        if (userCodeCheck) {
          setIsLoadingCheck(true)

          const queryObj = {
            offset: 0,
            limit: 1000,
            search: userCodeCheck,
          }
          const response = await getAllStaff(queryObj)
          if (checkSameUserCode(response?.data?.data, userCodeCheck)) {
            setIsSameUserCode(true)
          } else {
            setIsSameUserCode(false)
          }
          setIsLoadingCheck(false)

          return response?.data
        }
      },
      enabled: !!userCodeCheck,
    },
  ])
  const { imageUrlResponse, handleUploadImage } = useUploadImage()

  useEffect(() => {
    if (imageUrlResponse) {
      setStaffAccountObject({
        ...staffAccountObject,
        image: imageUrlResponse,
      })
    }
  }, [imageUrlResponse])

  return (
    <div>
      <div className="bg-white block-border">
        <SmallTitle>{t("personal_imformation")}</SmallTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-73">
          <div>
            <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
              <div>
                <PrimaryInput
                  title={
                    <p>
                      {t("full_name")} <span className="text-red-500">*</span>
                    </p>
                  }
                  placeholder={t("enter_full_name")}
                  value={staffAccountObject?.userName || ""}
                  onChange={(e) => {
                    const userName = e.target.value
                      ?.trimStart()
                      .replace(/\s{2,}/g, " ")
                    setStaffAccountObject({
                      ...staffAccountObject,
                      userName: userName,
                    })
                  }}
                />
                {staffAccountObject?.userName &&
                  !isValidFullName(staffAccountObject?.userName) && (
                    <div className="text-sm text-red-500">
                      {t("full_name_warning")}
                    </div>
                  )}
              </div>
              <SelectRoleDropdown
                title={t("staff_position")}
                listDropdown={[
                  { id: 2, value: t("store_keeper") },
                  {
                    id: 3,
                    value: t("seller"),
                  },
                ]}
                showing={selectRole}
                setShowing={setSelectRole}
              />
              <div>
                <PrimaryInput
                  title={t("staff_id")}
                  placeholder={t("enter_staff_id")}
                  type="number"
                  onChange={(e) => {
                    setStaffAccountObject({
                      ...staffAccountObject,
                      identity: e.target.value,
                    })
                  }}
                />

                {checkStringLength(staffAccountObject?.identity, 12) && (
                  <div className="text-sm text-red-500">
                    {t("identity_max")}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-2">
              <div>
                <PrimaryInput
                  title={
                    <p>
                      {t("userName")} <span className="text-red-500">*</span>
                    </p>
                  }
                  placeholder={t("enter_username")}
                  value={staffAccountObject?.userCode || ""}
                  onChange={(e) => {
                    const userInput = e.target.value?.trim().replace(/\s+/g, "")
                    setStaffAccountObject({
                      ...staffAccountObject,
                      userCode: userInput,
                    })
                  }}
                />
                {isLoadingCheck ? (
                  <Loading />
                ) : (
                  isSameUserCode && (
                    <div className="text-sm text-red-500">
                      {t("user_code_max")}
                    </div>
                  )
                )}
              </div>
              <div>
                <PasswordInput
                  title={
                    <div className="flex gap-1">
                      <h1>
                        {t("password")} <span className="text-red-500">*</span>
                      </h1>
                    </div>
                  }
                  onChange={(e) => {
                    setStaffAccountObject({
                      ...staffAccountObject,
                      password: e.target.value,
                    })
                  }}
                  placeholder={t("enter_password_placeholder")}
                />
                {!canChangePassword && staffAccountObject?.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {t("password_warnnig")}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-3">
              <div>
                <PrimaryInput
                  title={t("phone_number")}
                  placeholder={t("enter_number")}
                  type="number"
                  onChange={(e) => {
                    setStaffAccountObject({
                      ...staffAccountObject,
                      phone: e.target.value,
                    })
                  }}
                />
                {staffAccountObject?.phone &&
                  !!!isValidPhoneNumber(staffAccountObject?.phone) && (
                    <p className="text-red-500">{t("wrong_valid")}</p>
                  )}
              </div>
              <SelectGenderDropdown
                title={t("gender")}
                textDefault={t("male")}
                listDropdown={[
                  { id: true, value: t("male") },
                  { id: false, value: t("female") },
                ]}
                showing={gender}
                setShowing={setGender}
              />
              <div>
                <div className="mb-2 text-sm font-bold text-gray">
                  {t("dob")}
                </div>
                <input
                  max={new Date().toISOString().slice(0, 10)}
                  value={
                    staffAccountObject?.birthDate
                      ? format(
                          new Date(staffAccountObject?.birthDate),
                          "yyyy-MM-dd",
                        )
                      : ""
                  }
                  onChange={(e) => {
                    const selectedDate = e.target.value
                    const currentDate = new Date().toISOString().slice(0, 10)
                    if (selectedDate > currentDate) {
                      setStaffAccountObject({
                        ...staffAccountObject,
                        birthDate: currentDate,
                      })
                    } else {
                      setStaffAccountObject({
                        ...staffAccountObject,
                        birthDate: selectedDate,
                      })
                    }
                  }}
                  type="date"
                  className="w-full h-[46px] px-4 py-3 border rounded-md outline-none border-gray focus:border-primary hover:border-primary smooth-transform"
                />
              </div>
            </div>
            <div>
              <PrimaryTextArea
                className="mt-7"
                title={t("detail_adderss")}
                rows={4}
                placeholder={t("enter_detail_address")}
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    address: e.target.value,
                  })
                }}
              />
              {checkStringLength(staffAccountObject?.address, 250) && (
                <div className="text-sm text-red-500">
                  {t("max_address_length")}
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-auto">
            <div className="flex flex-col items-center justify-between h-full">
              <div>
                <div className="mb-5 text-xl font-semibold text-center">
                  {t("image_staff")}
                </div>
                <div className="flex items-center justify-center border rounded border-primary w-[200px] h-[200px]">
                  <UploadImage
                    imageUrlResponse={imageUrlResponse}
                    onChange={(e) => handleUploadImage(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-6 absolute-right">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between w-full gap-4 fle md:grid-cols-4 ">
              <div className="w-[200px]">
                <ConfirmPopup
                  classNameBtn="bg-cancelBtn border-cancelBtn active:bg-cancelDark w-52"
                  title={t("cancel_create_staff")}
                  handleClickSaveBtn={handleOut}
                >
                  {t("cancel")}
                </ConfirmPopup>
              </div>

              <div className="w-[200px]">
                <ConfirmPopup
                  classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
                  title={t("confirm_create_staff")}
                  handleClickSaveBtn={handleClickSaveBtn}
                  disabled={
                    isSubmitted ||
                    !!!staffAccountObject?.userCode ||
                    (staffAccountObject?.phone &&
                      !!!isValidPhoneNumber(staffAccountObject?.phone)) ||
                    (!canChangePassword && staffAccountObject?.password) ||
                    staffAccountObject?.userName?.length > 100 ||
                    staffAccountObject?.identity?.length > 12 ||
                    staffAccountObject?.address?.length > 250 ||
                    isSameUserCode ||
                    !!!staffAccountObject?.userName ||
                    !isValidFullName(staffAccountObject?.userName)
                  }
                >
                  {t("save")}
                </ConfirmPopup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateStaff
