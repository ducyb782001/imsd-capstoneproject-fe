import React, { useState } from "react"
import AddImage from "../AddImage"
import Loading from "../Loading"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import { IKImage } from "imagekitio-react"
import Switch from "react-switch"
import SelectRoleDropdown from "../Profile/SelectRoleDropdown"
import PrimaryBtn from "../PrimaryBtn"
import SelectGenderDropdown from "../Profile/SelectGenderDropdown"
import Tooltip from "../ToolTip"
import InfoIcon from "../icons/InfoIcon"
import ConfirmPopup from "../ConfirmPopup"
import { useRouter } from "next/router"

function CreateStaff() {
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [isEnabled, setIsEnabled] = useState(true)
  const [birthDate, setBirthDate] = useState<any>()
  const [gender, setGender] = useState()
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
  const router = useRouter()
  return (
    <div className="grid gap-4 md:grid-cols-73">
      <div className="bg-white block-border">
        <div className="flex items-center justify-between">
          <SmallTitle>Thông tin chung</SmallTitle>
          <ConfirmPopup
            className="!w-fit"
            classNameBtn="w-[120px]"
            title="Dữ liệu bạn vừa nhập sẽ không được lưu, bạn muốn thoát không?"
            handleClickSaveBtn={() => {
              router.push("/manage-staff")
            }}
          >
            Thoát
          </ConfirmPopup>
        </div>
        <div className="grid grid-cols-2 mt-4 gap-7">
          <PrimaryInput title="Họ và tên" placeholder="Nhập họ và tên" />
          <PrimaryInput
            title={
              <div className="flex items-center gap-2">
                <h1>Mã nhân viên</h1>
                <Tooltip content="Mã nhân viên phải là duy nhất và sẽ sử dụng để đăng nhập">
                  <InfoIcon />
                </Tooltip>
              </div>
            }
            placeholder="Nhập mã nhân viên hoặc bỏ trống"
          />
          <PrimaryInput title="Số CCCD/ CMND" />
          <PrimaryInput title="Số điện thoại" type="number" />
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
            <div className="mb-2 text-sm font-bold text-gray">Ngày sinh</div>
            <input
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value)
              }}
              type="date"
              className="w-full h-[46px] px-4 py-3 border rounded-md outline-none border-gray focus:border-primary hover:border-primary smooth-transform"
            />
          </div>
          <PrimaryInput title="Mật khẩu" type="number" />
        </div>
        <PrimaryTextArea
          className="mt-7"
          title="Địa chỉ chi tiết"
          placeholder="Nhập địa chỉ chi tiết của nhân viên"
        />
      </div>
      <div>
        <div className="w-full h-auto bg-white block-border">
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
        <div className="mt-4 bg-white block-border">
          <SmallTitle className="text-center">Thông tin bổ sung</SmallTitle>
          <SelectRoleDropdown
            className="mt-6"
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
          <p className="mt-4">Trạng thái</p>
          <div className="flex items-center justify-between">
            <p className="text-gray">Cho phép hoạt động</p>
            <Switch
              onChange={() => {
                setIsEnabled(!isEnabled)
              }}
              checked={isEnabled}
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
        <div className="flex gap-4 mt-4 bg-white block-border">
          <PrimaryBtn
            className="bg-cancelBtn border-cancelBtn active:bg-cancelDark max-w-[85px]"
            //   onClick={handleAddProduct}
            //   disabled={disabled}
          >
            Hủy
          </PrimaryBtn>
          <PrimaryBtn
            className="bg-successBtn border-successBtn active:bg-greenDark"
            //   onClick={handleAddProduct}
            //   disabled={disabled}
          >
            Thêm nhân viên
          </PrimaryBtn>
        </div>
      </div>
    </div>
  )
}

export default CreateStaff
