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
import useTrans from "../../hooks/useTrans"

function Profile() {
  const trans = useTrans()
  const [gender, setGender] = useState({ id: 1, value: "Nam" })
  const [birthDate, setBirthDate] = useState<any>(new Date())
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [staffAccountObject, setStaffAccountObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const [selectRole, setSelectRole] = useState({
    id: 2,
    value: "Nhân viên bán hàng",
  })

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
        <SmallTitle>{trans.common.personalInformation}</SmallTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-73">
          <div>
            <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
              <PrimaryInput
                title="Họ và tên"
                placeholder="Nhập họ và tên"
                value={staffAccountObject?.userName}
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    userName: e.target.value,
                  })
                }}
              />
              <PrimaryInput
                title="Vị trí"
                value={staffAccountObject?.roleId}
                readOnly={true}
              />
              <PrimaryInput
                title="Số CCCD/CMND"
                placeholder={"Nhập số CCCD/CMND"}
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
                title="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập của nhân viên"
                readOnly={true}
                value={staffAccountObject?.userCode}
              />
              <PasswordInput
                title={
                  <div className="flex gap-1">
                    <h1>Mật khẩu</h1>
                    <Tooltip
                      content={
                        <div>
                          Mật khẩu mặc định khi tạo nhân viên là 123456aA@
                        </div>
                      }
                    >
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
                title="Số điện thoại"
                placeholder="Nhập số điện thoại"
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
                title="Giới tính"
                listDropdown={[
                  { id: 1, value: "Nam" },
                  { id: 2, value: "Nữ" },
                ]}
                showing={gender}
                setShowing={setGender}
              />
              <div>
                <div className="mb-2 text-sm font-bold text-gray">
                  Ngày sinh
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
              title="Địa chỉ chi tiết"
              rows={4}
              placeholder="Nhập địa chỉ chi tiết"
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
                  Ảnh Đại diện
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
        <PrimaryBtn className="max-w-[182px] mt-6">Lưu</PrimaryBtn>
      </div>
      <div className="mt-10 bg-white block-border">
        <SmallTitle>Đổi mật khẩu</SmallTitle>
        <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
          <PasswordInput
            title="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu hiện tại"
          />
          <PasswordInput title="Mật khẩu mới" placeholder="Nhập mật khẩu mới" />
          <PasswordInput
            title="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu mới"
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
          Lưu
        </PrimaryBtn>
      </div>
    </div>
  )
}

export default Profile
