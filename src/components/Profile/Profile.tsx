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
import SelectRoleDropdown from "./SelectRoleDropdown"

function Profile() {
  const [gender, setGender] = useState({ id: 1, value: "Nam" })
  const [birthDate, setBirthDate] = useState<any>(new Date())
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [selectRole, setSelectRole] = useState({
    id: 2,
    value: "Nhân viên bán hàng",
  })

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
        <SmallTitle>Thông tin cá nhân</SmallTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-73">
          <div>
            <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
              <PrimaryInput title="Họ và tên" placeholder="Nhập họ và tên" />
              <SelectRoleDropdown
                title={
                  <p>
                    Vị trí <span className="text-red-500">*</span>
                  </p>
                }
                listDropdown={[
                  { id: 1, value: "Thủ kho" },
                  {
                    id: 2,
                    value: "Nhân viên bán hàng",
                  },
                ]}
                showing={selectRole}
                setShowing={setSelectRole}
              />
              <div className="hidden md:block"></div>
            </div>

            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-2">
              <PrimaryInput
                title="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập của nhân viên"
                readOnly={true}
                value="ducndt"
              />
              <PrimaryInput
                title="Số CCCD/CMND"
                placeholder="Nhập số CCCD/CMND"
              />
            </div>
            <div className="grid grid-cols-1 mt-7 gap-7 md:grid-cols-3">
              <PrimaryInput
                title="Số điện thoại"
                placeholder="Nhập số điện thoại"
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
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value)
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
