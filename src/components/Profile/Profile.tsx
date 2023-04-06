import React, { useEffect, useState } from "react"
import Loading from "../Loading"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import SelectGenderDropdown from "./SelectGenderDropdown"
import { IKImage } from "imagekitio-react"
import AddImage from "../AddImage"
import Tooltip from "../ToolTip"
import InfoIcon from "../icons/InfoIcon"
import { useMutation, useQueries } from "react-query"
import { useRouter } from "next/router"
import { getDetailStaff } from "../../apis/user-module"
import { useTranslation } from "react-i18next"
import useGetMe from "../../hooks/useGetMe"
import { updateProfile } from "../../apis/profile-module"
import { toast } from "react-toastify"
import { checkPassword, checkSamePassword } from "../../lib/check-password"
import { changePassword } from "../../apis/auth"
import { format } from "date-fns"
import DetailStaffSkeleton from "../ManageStaff/DetailStaffSkeleton"
import { isValidPhoneNumber } from "../../hooks/useValidator"

function Profile() {
  const { t } = useTranslation()
  const [gender, setGender] = useState({ id: 1, value: "Nam" })
  const [birthDate, setBirthDate] = useState<any>(new Date())
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

  const onErrorUpload = (error: any) => {
    console.log("Run upload error", error)
    setLoadingImage(false)
  }

  const onSuccessUpload = (res: any) => {
    // setImages([...images, res.filePath])
    console.log("Run onsucces here")
    setImageUploaded(res.url)
    setLoadingImage(false)
  }

  useEffect(() => {
    if (imageUploaded) {
      setStaffAccountObject({
        ...staffAccountObject,
        image: imageUploaded,
      })
    }
  }, [imageUploaded])

  const updateProfileMutation = useMutation(
    async (dataUpdate) => {
      return await updateProfile(dataUpdate)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Update profile success!")
        } else {
          toast.error(
            data?.response?.data?.message ||
              data?.message ||
              "Opps! Something went wrong...",
          )
        }
      },
    },
  )

  const handleChangeProfile = () => {
    // Change profile validate

    // @ts-ignore
    updateProfileMutation.mutate(staffAccountObject)
  }

  const changePasswordMutation = useMutation(
    async (password) => {
      return await changePassword(password)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Change password success!")
        } else {
          toast.error(
            data?.response?.data?.message ||
              data?.message ||
              "Opps! Something went wrong...",
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

  return isLoading ? (
    <DetailStaffSkeleton />
  ) : (
    <div>
      <div className="bg-white block-border">
        <SmallTitle>{t("personal_imformation")}</SmallTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-73">
          <div>
            <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
              <PrimaryInput
                title={t("full_name")}
                placeholder={t("enter_full_name")}
                value={
                  staffAccountObject?.userName
                    ? staffAccountObject?.userName
                    : ""
                }
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    userName: e.target.value,
                  })
                }}
              />
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
              />
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
                    <p className="text-red-500">Sai định dạng</p>
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
        <PrimaryBtn
          onClick={() => handleChangeProfile()}
          className="max-w-[182px] mt-6"
          disabled={
            staffAccountObject?.phone &&
            !!!isValidPhoneNumber(staffAccountObject?.phone)
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
              {!canChangePassword &&
                newPassword &&
                "* Password must be at least 8 characters with at least 1 Upper Case, 1 lower case, 1 special character and 1 numeric character"}
            </p>
          </div>
          <div>
            <PasswordInput
              title={t("re_password")}
              placeholder={t("enter_re_password")}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!confirmChange && confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                Mật khẩu phải trùng nhau
              </p>
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
