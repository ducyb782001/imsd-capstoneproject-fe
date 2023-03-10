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
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { createStaff } from "../../apis/user-module"
import router from "next/router"
import { format } from "date-fns"
import useTrans from "../../hooks/useTrans"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function CreateStaff() {
  const trans = useTrans()
  const [gender, setGender] = useState<any>()
  const [birthDate, setBirthDate] = useState<any>(new Date())
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [staffAccountObject, setStaffAccountObject] = useState<any>()

  useEffect(() => {
    setStaffAccountObject({
      ...staffAccountObject,
      userId: 0,
      password: "123456aA@",
      roleId: 1,
      status: true,
      gender: true,
    })
  }, [])

  useEffect(() => {
    if (gender) {
      setStaffAccountObject({
        ...staffAccountObject,
        gender: gender.id,
      })
    }
  }, [gender])

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
    // setStaffAccountObject({
    //   ...staffAccountObject,
    //   identity: res.url,
    // })
  }
  const createStaffMutation = useMutation(
    async (importProduct) => {
      return await createStaff(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm nhân viên thành công")
          router.push("/manage-staff")
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
    createStaffMutation.mutate({ ...staffAccountObject })
  }
  const handleOut = (event) => {
    router.push("/manage-staff")
  }
  console.log(staffAccountObject)

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
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    userName: e.target.value,
                  })
                }}
              />
              <SelectRoleDropdown
                title={<p>Vị trí</p>}
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
              <PrimaryInput
                title="Số CCCD/CMND"
                placeholder="Nhập số CCCD/CMND"
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
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </p>
                }
                placeholder="Nhập tên đăng nhập của nhân viên"
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    userCode: e.target.value,
                  })
                }}
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
                onChange={(e) => {
                  setStaffAccountObject({
                    ...staffAccountObject,
                    phone: e.target.value,
                  })
                }}
              />
              <SelectGenderDropdown
                title="Giới tính"
                textDefault="Nam"
                listDropdown={[
                  { id: true, value: "Nam" },
                  { id: false, value: "Nữ" },
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
                      ? format(
                          new Date(staffAccountObject?.birthDate),
                          "dd/MM/yyyy",
                        )
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
        <div className="flex items-center mt-6 absolute-right">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between w-full gap-4 fle md:grid-cols-4 ">
              <div className="w-[200px]">
                <ConfirmPopup
                  classNameBtn="bg-cancelBtn border-cancelBtn active:bg-cancelDark w-52"
                  title="Bạn có chắc chắn muốn hủy tạo nhân viên không?"
                  handleClickSaveBtn={handleOut}
                >
                  Hủy
                </ConfirmPopup>
              </div>

              <div className="w-[200px]">
                <ConfirmPopup
                  classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
                  title="Bạn có chắc chắn muốn tạo nhân viên không?"
                  handleClickSaveBtn={handleClickSaveBtn}
                  //   disabled={disabled}
                >
                  Lưu
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
