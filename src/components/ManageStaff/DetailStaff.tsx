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
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  createStaff,
  getDetailStaff,
  updateStaff,
} from "../../apis/user-module"
import router, { useRouter } from "next/router"
import { format } from "date-fns"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function EditStaff() {
  const [gender, setGender] = useState<any>()
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")
  const [staffAccountObject, setStaffAccountObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  useEffect(() => {
    setStaffAccountObject({
      ...staffAccountObject,
      status: staffAccountObject?.status,
      password: "123456aA@",
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
    // setStaffAccountObject({
    //   ...staffAccountObject,
    //   identity: res.url,
    // })
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
          toast.success("Ch???nh s???a nh??n vi??n th??nh c??ng")
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
    toast.loading("Thao t??c ??ang ???????c x??? l?? ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    updateStaffMutation.mutate(staffAccountObject)
  }
  const handleOut = (event) => {
    router.push("/manage-staff")
  }
  console.log(staffAccountObject)

  return (
    <div>
      <div className="bg-white block-border">
        <SmallTitle>Th??ng tin c?? nh??n</SmallTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-73">
          <div>
            <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-7">
              <PrimaryInput
                title="H??? v?? t??n"
                placeholder="Nh???p h??? v?? t??n"
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
                title={<p>V??? tr??</p>}
                listDropdown={[
                  { id: 1, value: "Th??? kho" },
                  {
                    id: 2,
                    value: "Nh??n vi??n b??n h??ng",
                  },
                ]}
                textDefault={staffAccountObject?.role?.roleName}
                showing={selectRole}
                setShowing={setSelectRole}
              />
              <PrimaryInput
                title="S??? CCCD/CMND"
                placeholder={"Nh???p s??? CCCD/CMND"}
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
                title={<p>T??n ????ng nh???p</p>}
                value={
                  staffAccountObject?.userCode
                    ? staffAccountObject?.userCode
                    : ""
                }
                readOnly={true}
              />
              <PasswordInput
                title={
                  <div className="flex gap-1">
                    <h1>M???t kh???u</h1>
                    <Tooltip
                      content={
                        <div>
                          M???t kh???u m???c ?????nh khi t???o nh??n vi??n l?? 123456aA@
                        </div>
                      }
                    >
                      <InfoIcon />
                    </Tooltip>
                  </div>
                }
                value={
                  staffAccountObject?.password
                    ? staffAccountObject?.password
                    : ""
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
                title="S??? ??i???n tho???i"
                placeholder="Nh???p s??? ??i???n tho???i"
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
                title="Gi???i t??nh"
                textDefault="Nam"
                listDropdown={[
                  { id: true, value: "Nam" },
                  { id: false, value: "N???" },
                ]}
                showing={gender}
                setShowing={setGender}
              />
              <div>
                <div className="mb-2 text-sm font-bold text-gray">
                  Ng??y sinh
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
              title="?????a ch??? chi ti???t"
              rows={4}
              placeholder="Nh???p ?????a ch??? chi ti???t"
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
                  ???nh ?????i di???n
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
                  title="B???n c?? ch???c ch???n mu???n h???y ch???nh s???a nh??n vi??n kh??ng?"
                  handleClickSaveBtn={handleOut}
                >
                  H???y
                </ConfirmPopup>
              </div>

              <div className="w-[200px]">
                <ConfirmPopup
                  classNameBtn="bg-successBtn border-successBtn active:bg-greenDark"
                  title="B???n c?? ch???c ch???n mu???n ch???nh s???a nh??n vi??n kh??ng?"
                  handleClickSaveBtn={handleClickSaveBtn}
                  //   disabled={disabled}
                >
                  L??u
                </ConfirmPopup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditStaff
