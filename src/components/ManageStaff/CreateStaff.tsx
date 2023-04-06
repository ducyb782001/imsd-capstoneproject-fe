import React, { useEffect, useState } from "react"
import Loading from "../Loading"
import PasswordInput from "../PasswordInput"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import SelectGenderDropdown from "../Profile/SelectGenderDropdown"
import { IKImage } from "imagekitio-react"
import AddImage from "../AddImage"
import SelectRoleDropdown from "../Profile/SelectRoleDropdown"
import Tooltip from "../ToolTip"
import InfoIcon from "../icons/InfoIcon"
import ConfirmPopup from "../ConfirmPopup"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { createStaff } from "../../apis/user-module"
import router from "next/router"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { checkPassword } from "../../lib/check-password"
import { isValidPhoneNumber } from "../../hooks/useValidator"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"
const TOAST_UPLOAD_IMAGE = "toast-upload-image"

function CreateStaff() {
  const { t } = useTranslation()
  const [gender, setGender] = useState<any>()
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [staffAccountObject, setStaffAccountObject] = useState<any>()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [selectRole, setSelectRole] = useState({
    id: 3,
    value: t("seller"),
  })

  const onErrorUpload = (error: any) => {
    toast.dismiss(TOAST_UPLOAD_IMAGE)
    console.log("Run upload error", error)
    setLoadingImage(false)
  }

  const onSuccessUpload = (res: any) => {
    toast.dismiss(TOAST_UPLOAD_IMAGE)
    console.log("Run onsucces here")
    setImageUploaded(res.url)
    setLoadingImage(false)
  }

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

  return (
    <div>
      <div className="bg-white block-border">
        <SmallTitle>{t("personal_imformation")}</SmallTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-73">
          <div>
            <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
              <PrimaryInput
                title={t("full_name")}
                placeholder={t("enter_full_name")}
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    userName: e.target.value,
                  })
                }}
              />
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
              <PrimaryInput
                title={t("staff_id")}
                placeholder={t("enter_staff_id")}
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    identity: e.target.value,
                  })
                }}
              />
            </div>

            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-2">
              <PrimaryInput
                title={
                  <p>
                    {t("userName")} <span className="text-red-500">*</span>
                  </p>
                }
                placeholder={t("enter_username")}
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    userCode: e.target.value,
                  })
                }}
              />
              <div>
                <PasswordInput
                  title={
                    <div className="flex gap-1">
                      <h1>{t("password")}</h1>
                      <Tooltip content={<div>{t("password_default")}</div>}>
                        <InfoIcon />
                      </Tooltip>
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
                    * Password must be at least 8 characters with at least 1
                    Upper Case, 1 lower case, 1 special character and 1 numeric
                    character
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
                    <p className="text-red-500">Sai định dạng</p>
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
          </div>
          <div className="w-full h-auto">
            <div className="flex flex-col items-center justify-between h-full">
              <div>
                <div className="mb-5 text-xl font-semibold text-center">
                  {t("image_staff")}
                </div>
                <div className="flex items-center justify-center border rounded border-primary w-[200px] h-[200px]">
                  <AddImage
                    onError={onErrorUpload}
                    onSuccess={onSuccessUpload}
                    imageUploaded={imageUploaded}
                    setLoadingImage={setLoadingImage}
                    toastLoadingId={TOAST_UPLOAD_IMAGE}
                  >
                    {loadingImage ? (
                      <div className="w-full h-[176px] flex items-center justify-center">
                        <Loading />
                      </div>
                    ) : imageUploaded ? (
                      <IKImage className="rounded" src={imageUploaded} />
                    ) : (
                      ""
                    )}
                  </AddImage>
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
                    (!canChangePassword && staffAccountObject?.password)
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
