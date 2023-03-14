import React, { useEffect, useState } from "react"
import Loading from "../Loading"
import PasswordInput from "../PasswordInput"
import PrimaryBtn from "../PrimaryBtn"
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
import { useMutation, useQueries, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import { getDetailStaff, updateStaff } from "../../apis/user-module"
import router, { useRouter } from "next/router"
import { format } from "date-fns"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"
import { useTranslation } from "react-i18next"
import { checkPassword } from "../../lib/check-password"
import { changePassword } from "../../apis/auth"
import Switch from "react-switch"
import DetailStaffSkeleton from "./DetailStaffSkeleton"

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
    if (staffAccountObject) {
      setStatusStaff(staffAccountObject?.status)
    }
  }, [staffAccountObject])

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

  const router = useRouter()
  const { staffId } = router.query

  useQueries([
    {
      queryKey: ["getDetailStaff", staffId],
      queryFn: async () => {
        const detail = await getDetailStaff(staffId)
        setStaffAccountObject(detail?.data)
        setIsLoadingReport(detail?.data?.isLoading)
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
          toast.success("Chỉnh sửa nhân viên thành công")
          queryClient.invalidateQueries("getDetailStaff")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
            )
          }
        }
      },
    },
  )

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
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
    if (staffId != undefined) {
      // @ts-ignore
      changePasswordMutation.mutate({
        userId: staffId,
        password: newPassword,
      })
    }
  }
  const handleChangeStatus = () => {}

  const canChangePassword = checkPassword(newPassword, confirmPassword)

  return isLoadingReport ? (
    <DetailStaffSkeleton />
  ) : (
    <div>
      <div className="bg-white block-border">
        <SmallTitle>{t("profile_detail")}</SmallTitle>
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
                <label className="mb-2 text-sm font-bold text-gray">
                  {t("status")}
                </label>
                <div className="h-[40px] mt-4">
                  <Switch
                    onChange={handleChangeStatus}
                    readOnly={true}
                    checked={statusStaff}
                    width={44}
                    height={24}
                    className="ml-2 !opacity-100"
                    uncheckedIcon={null}
                    checkedIcon={null}
                    offColor="#CBCBCB"
                    onColor="#6A44D2"
                  />
                </div>
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
            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-3">
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
              <SelectGenderDropdown
                title={t("gender")}
                textDefault={
                  staffAccountObject?.gender == true ? t("male") : t("gender")
                }
                listDropdown={[
                  { id: true, value: "Nam" },
                  { id: false, value: "Nữ" },
                ]}
                showing={gender}
                setShowing={setGender}
              />
              <div>
                <div className="mb-2 text-sm font-bold text-gray">
                  {t("dob")}
                </div>
                <input
                  value={
                    staffAccountObject?.birthDate
                      ? format(
                          new Date(staffAccountObject?.birthDate),
                          "yyyy-MM-dd",
                        )
                      : format(Date.now(), "yyyy-MM-dd")
                  }
                  onChange={(e) => {
                    setStaffAccountObject({
                      ...staffAccountObject,
                      birthDate: e.target.value,
                    })
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
              value={staffAccountObject?.address}
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
        <PrimaryBtn className="max-w-[182px] mt-6" onClick={handleClickSaveBtn}>
          {t("save")}
        </PrimaryBtn>
      </div>
      <div className="mt-10 bg-white block-border">
        <SmallTitle>{t("update_password")}</SmallTitle>
        <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
          <PasswordInput
            title={t("new_password")}
            placeholder={t("enter_new_password")}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordInput
            title={t("re_password")}
            placeholder={t("enter_re_password")}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <p className="h-6 mt-1 text-sm text-red-500">
          {!canChangePassword &&
            newPassword &&
            "* Password must be at least 8 characters with at least 1 Upper Case, 1 lower case, 1 special character and 1 numeric character"}
        </p>
        <PrimaryBtn
          className="max-w-[182px] mt-6"
          onClick={() => handleChangePassword()}
          disabled={!canChangePassword}
        >
          {t("save")}
        </PrimaryBtn>
      </div>
    </div>
  )
}

export default DetailStaff
