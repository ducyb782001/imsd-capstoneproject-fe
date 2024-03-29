import React, { useEffect, useState } from "react"
import Loading from "../Loading"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import SelectGenderDropdown from "../Profile/SelectGenderDropdown"
import SelectRoleDropdown from "../Profile/SelectRoleDropdown"
import { useMutation, useQueries, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import { getDetailStaff, updateStaff } from "../../apis/user-module"
import router, { useRouter } from "next/router"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { checkPassword, checkSamePassword } from "../../lib/check-password"
import { changePassword } from "../../apis/auth"
import DetailStaffSkeleton from "./DetailStaffSkeleton"
import GeneralIcon from "../icons/GeneralIcon"
import PasswordIcon from "../icons/PasswordIcon"
import { isValidFullName, isValidPhoneNumber } from "../../hooks/useValidator"
import Page401 from "../401"
import GreenStatus from "../ReturnGood/GreenStatus"
import YellowStatus from "../ReturnGood/YellowStatus"
import { checkStringLength } from "../../lib"
import UploadImage from "../UploadImage"
import useUploadImage from "../../hooks/useUploadImage"

const TOAST_UPLOAD_IMAGE = "toast-upload-image"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function DetailStaff() {
  const { t } = useTranslation()
  const [gender, setGender] = useState<any>()
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [staffAccountObject, setStaffAccountObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const [statusStaff, setStatusStaff] = useState<any>(true)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const queryClient = useQueryClient()

  useEffect(() => {
    if (gender) {
      setStaffAccountObject({
        ...staffAccountObject,
        gender: gender.id,
      })
    }
  }, [gender])

  const [selectRole, setSelectRole] = useState<any>()

  useEffect(() => {
    if (selectRole) {
      setStaffAccountObject({
        ...staffAccountObject,
        roleId: selectRole.id,
      })
    }
  }, [selectRole])

  useEffect(() => {
    if (imageUploaded) {
      setStaffAccountObject({
        ...staffAccountObject,
        image: imageUploaded,
      })
    }
  }, [imageUploaded])

  const router = useRouter()
  const { staffId } = router.query

  const [userData, setUserData] = useState<any>()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData != "undefined") {
        setUserData(JSON.parse(userData))
      }
    }
  }, [])

  useQueries([
    {
      queryKey: ["getDetailStaff", staffId],
      queryFn: async () => {
        setIsLoadingReport(true)
        const detail = await getDetailStaff(staffId)
        setStaffAccountObject(detail?.data)
        setStatusStaff(detail?.data?.status)
        setImageUploaded(detail?.data?.image)
        setIsLoadingReport(false)
        return detail?.data
      },
      enabled: !!staffId,
    },
  ])

  const updateStaffMutation = useMutation(
    async (staff) => {
      return await updateStaff(staff)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("edit_staff_succeed"))
          queryClient.invalidateQueries("getDetailStaff")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0] || t("error_occur"))
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
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    updateStaffMutation.mutate(staffAccountObject)
  }

  const changePasswordMutation = useMutation(
    async (password) => {
      return await changePassword(password)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success(t("change_password_succeed"))
        } else {
          toast.error(
            data?.response?.data?.message || data?.message || t("error_occur"),
          )
        }
      },
    },
  )

  const handleChangePassword = () => {
    if (staffId != undefined) {
      // @ts-ignore
      changePasswordMutation.mutate({
        userId: staffId,
        password: newPassword,
      })
    }
  }

  const canChangePassword = checkPassword(newPassword)
  const confirmChange = checkSamePassword(newPassword, confirmPassword)

  const { imageUrlResponse, handleUploadImage } = useUploadImage()
  useEffect(() => {
    if (imageUrlResponse) {
      setStaffAccountObject({
        ...staffAccountObject,
        image: imageUrlResponse,
      })
    }
  }, [imageUrlResponse])

  return isLoadingReport ? (
    <DetailStaffSkeleton />
  ) : userData?.roleId !== 1 ? (
    <Page401 />
  ) : (
    <div>
      <div className="bg-white block-border">
        <div className="flex items-center gap-3">
          <GeneralIcon />
          <SmallTitle>{t("profile_detail")}</SmallTitle>
        </div>
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
                  value={
                    staffAccountObject?.userName
                      ? staffAccountObject?.userName
                      : ""
                  }
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
                title={t("position")}
                listDropdown={[
                  { id: 2, value: t("store_keeper") },
                  {
                    id: 3,
                    value: t("seller"),
                  },
                ]}
                textDefault={
                  staffAccountObject?.id == 2 ? t("store_keeper") : t("seller")
                }
                showing={selectRole}
                setShowing={setSelectRole}
              />
              <div>
                <div className="mb-3 text-sm font-bold text-gray">
                  {t("status")}
                </div>
                {statusStaff === true && (
                  <GreenStatus status={t("on_progress")} />
                )}
                {statusStaff === false && (
                  <YellowStatus status={t("off_progress")} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-2">
              <PrimaryInput
                title={t("userName")}
                value={
                  staffAccountObject?.userCode
                    ? staffAccountObject?.userCode
                    : ""
                }
                readOnly={true}
              />
              <div>
                <PrimaryInput
                  title={t("staff_id")}
                  placeholder={t("enter_staff_id")}
                  value={
                    staffAccountObject?.identity
                      ? staffAccountObject?.identity
                      : ""
                  }
                  onChange={(e) => {
                    setStaffAccountObject({
                      ...staffAccountObject,
                      identity: e.target.value,
                    })
                  }}
                  type="number"
                />
                {checkStringLength(staffAccountObject?.identity, 12) && (
                  <div className="text-sm text-red-500">
                    {t("identity_max")}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-3">
              <div>
                <PrimaryInput
                  title={t("phone_number")}
                  placeholder={t("enter_number")}
                  type="number"
                  value={
                    staffAccountObject?.phone ? staffAccountObject?.phone : ""
                  }
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
                textDefault={
                  staffAccountObject?.gender ? t("male") : t("female")
                }
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
                value={staffAccountObject?.address}
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
                    imageUrlResponse={
                      imageUrlResponse
                        ? imageUrlResponse
                        : staffAccountObject?.image
                    }
                    onChange={(e) => handleUploadImage(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <PrimaryBtn
          className="max-w-[182px] mt-6"
          onClick={handleClickSaveBtn}
          disabled={
            (staffAccountObject?.phone &&
              !!!isValidPhoneNumber(staffAccountObject?.phone)) ||
            staffAccountObject?.userName?.length > 100 ||
            staffAccountObject?.identity?.length > 12 ||
            staffAccountObject?.address?.length > 250 ||
            !!!staffAccountObject?.userName ||
            !isValidFullName(staffAccountObject?.userName)
          }
        >
          {t("save")}
        </PrimaryBtn>
      </div>
      <div className="mt-10 bg-white block-border">
        <div className="flex items-center gap-3">
          <PasswordIcon />
          <SmallTitle>{t("update_password")}</SmallTitle>
        </div>
        <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
          <div>
            <PasswordInput
              title={
                <div>
                  {t("new_password")}
                  <span className="text-red-500"> *</span>
                </div>
              }
              placeholder={t("enter_new_password")}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {!canChangePassword && newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {t("password_warnnig")}
              </p>
            )}
          </div>
          <div>
            <PasswordInput
              title={
                <div>
                  {t("re_password")}
                  <span className="text-red-500"> *</span>
                </div>
              }
              placeholder={t("enter_re_password")}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!confirmChange && confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{t("same_password")}</p>
            )}
          </div>
        </div>
        <PrimaryBtn
          className="max-w-[182px] mt-6"
          onClick={() => handleChangePassword()}
          disabled={!confirmChange || !canChangePassword}
        >
          {t("save")}
        </PrimaryBtn>
      </div>
    </div>
  )
}

export default DetailStaff
