import React, { useState } from "react"
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
import { useQueries } from "react-query"
import { useRouter } from "next/router"
import { getDetailStaff } from "../../apis/user-module"
import { useTranslation } from "react-i18next"

function Profile() {
  const { t } = useTranslation()
  const [gender, setGender] = useState({ id: 1, value: "Nam" })
  const [birthDate, setBirthDate] = useState<any>(new Date())
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [staffAccountObject, setStaffAccountObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const router = useRouter()
  const { staffId } = router.query
  useQueries([
    {
      queryKey: ["getDetailProductImport", staffId],
      queryFn: async () => {
        const detail = await getDetailStaff(staffId)
        setStaffAccountObject(detail?.data)
        setIsLoadingReport(detail?.data?.isLoading)
        return detail?.data
      },
      enabled: !!staffId,
    },
  ])
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
                value={staffAccountObject?.userName}
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    userName: e.target.value,
                  })
                }}
              />
              <PrimaryInput
                title={t("staff_position")}
                value={staffAccountObject?.roleId}
                readOnly={true}
              />
              <PrimaryInput
                title={t("staff_id")}
                placeholder={t("enter_staff_id")}
                value={staffAccountObject?.identity}
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
                value={staffAccountObject?.userCode}
              />
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
              />
            </div>
            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-3">
              <PrimaryInput
                title={t("phone_number")}
                placeholder={t("enter_number")}
                type="number"
                value={staffAccountObject?.phone}
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    phone: e.target.value,
                  })
                }}
              />
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
                  value={
                    staffAccountObject?.birthDate
                      ? staffAccountObject?.birthDate
                      : ""
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
        <PrimaryBtn className="max-w-[182px] mt-6">{t("save")}</PrimaryBtn>
      </div>
      <div className="mt-10 bg-white block-border">
        <SmallTitle>{t("update_password")}</SmallTitle>
        <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
          <PasswordInput
            title={t("current_password")}
            placeholder={t("enter_current_pass")}
          />
          <PasswordInput
            title={t("new_password")}
            placeholder={t("enter_new_password")}
          />
          <PasswordInput
            title={t("re_password")}
            placeholder={t("enter_re_password")}
          />
        </div>
        {/* <p className="h-6 mt-1 text-sm text-red-500">
          {!canChangePassword &&
            newPassword &&
            "* Password must be at least 8 characters with at least 1 Upper Case, 1 lower case, 1 special character and 1 numeric character"}
        </p> */}
        <PrimaryBtn
          className="max-w-[182px] mt-6"
          // onClick={() => handleChangePassword()}
          // disabled={!canChangePassword}
        >
          {t("save")}
        </PrimaryBtn>
      </div>
    </div>
  )
}

export default Profile
