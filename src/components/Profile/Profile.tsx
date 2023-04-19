import React, { useEffect, useState } from "react"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import SelectGenderDropdown from "./SelectGenderDropdown"
import { useMutation, useQueryClient } from "react-query"
import { useTranslation } from "react-i18next"
import useGetMe from "../../hooks/useGetMe"
import { updateProfile } from "../../apis/profile-module"
import { toast } from "react-toastify"
import { checkPassword, checkSamePassword } from "../../lib/check-password"
import { changePassword } from "../../apis/auth"
import { format } from "date-fns"
import DetailStaffSkeleton from "../ManageStaff/DetailStaffSkeleton"
import { isValidFullName, isValidPhoneNumber } from "../../hooks/useValidator"
import { checkStringLength } from "../../lib"
import UploadImage from "../UploadImage"
import useUploadImage from "../../hooks/useUploadImage"
import { updateStaff } from "../../apis/user-module"

function Profile() {
  const { t } = useTranslation()
  const [gender, setGender] = useState({ id: 1, value: "Nam" })
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [staffAccountObject, setStaffAccountObject] = useState<any>()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { data, isLoading } = useGetMe()

  useEffect(() => {
    setStaffAccountObject(data)
    setImageUploaded(data?.image)
  }, [data])

  useEffect(() => {
    if (imageUploaded) {
      setStaffAccountObject({
        ...staffAccountObject,
        image: imageUploaded,
      })
    }
  }, [imageUploaded])

  const queryClient = useQueryClient()
  const updateProfileMutation = useMutation(
    async (dataUpdate) => {
      return await updateStaff(dataUpdate)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success(t("update_profile_success"))
          queryClient.invalidateQueries("getMeQuery")
        } else {
          toast.error(
            data?.response?.data?.message || data?.message || t("error_occur"),
          )
        }
      },
    },
  )

  const updateOwnerMutation = useMutation(
    async (dataUpdate) => {
      return await updateProfile(dataUpdate)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success(t("update_profile_success"))
          queryClient.invalidateQueries("getMeQuery")
        } else {
          toast.error(
            data?.response?.data?.message || data?.message || t("error_occur"),
          )
        }
      },
    },
  )

  const handleChangeProfile = () => {
    // Change profile validate
    if (staffAccountObject?.userCode) {
      // @ts-ignore
      updateProfileMutation.mutate(staffAccountObject)
    } else {
      // @ts-ignore
      updateOwnerMutation.mutate(staffAccountObject)
    }
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
    // @ts-ignore
    changePasswordMutation.mutate({
      userId: 0,
      oldPassword: currentPassword,
      password: newPassword,
    })
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

  return isLoading ? (
    <DetailStaffSkeleton />
  ) : (
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
              <PrimaryInput
                title={t("staff_position")}
                value={
                  staffAccountObject?.roleId === 1
                    ? t("owner")
                    : staffAccountObject?.roleId === 2
                    ? t("store_keeper")
                    : t("seller")
                }
                readOnly={true}
              />
              <div>
                <PrimaryInput
                  title={t("staff_id")}
                  placeholder={t("enter_staff_id")}
                  type="number"
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
                />
                {checkStringLength(staffAccountObject?.identity, 12) && (
                  <div className="text-sm text-red-500">
                    {t("identity_max")}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-2">
              <PrimaryInput
                title={t("userName")}
                placeholder={t("enter_username")}
                readOnly={true}
                value={
                  staffAccountObject?.userCode ||
                  staffAccountObject?.email ||
                  ""
                }
              />
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
            </div>
            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-2">
              <SelectGenderDropdown
                title={t("gender")}
                listDropdown={[
                  { id: 1, value: t("male") },
                  { id: 2, value: t("female") },
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
                value={
                  staffAccountObject?.address ? staffAccountObject?.address : ""
                }
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
          onClick={() => handleChangeProfile()}
          className="max-w-[182px] mt-6"
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
        <SmallTitle>{t("update_password")}</SmallTitle>
        <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
          <PasswordInput
            title={t("current_password")}
            placeholder={t("enter_current_pass")}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div>
            <PasswordInput
              title={t("new_password")}
              placeholder={t("enter_new_password")}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p className="h-6 mt-1 text-sm text-red-500">
              {!canChangePassword && newPassword && t("password_warnnig")}
            </p>
          </div>
          <div>
            <PasswordInput
              title={t("re_password")}
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
          disabled={!canChangePassword || !confirmChange}
        >
          {t("save")}
        </PrimaryBtn>
      </div>
    </div>
  )
}

export default Profile
