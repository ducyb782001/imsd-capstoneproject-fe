import React from "react"
import CameraIcon from "./icons/CameraIcon"
import UploadIcon from "./icons/UploadIcon"
import { IKUpload } from "imagekitio-react"
import Loading from "./Loading"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

function ChooseFileReason({
  children,
  imageUploaded,
  onError,
  onSuccess,
  className = "add-file",
  loadingImage = false,
  setLoadingImage,
  toastLoadingId = "",
}) {
  return (
    <label className={`cursor-pointer ${className}`}>
      {loadingImage ? (
        <div className="w-full min-h-[176px] flex items-center justify-center">
          <Loading />
        </div>
      ) : imageUploaded ? (
        <div className="flex flex-col items-center justify-center w-max">
          <div>{children}</div>
        </div>
      ) : (
        <div>
          <AddImageBtn />
        </div>
      )}
      <IKUpload
        onChange={() => {
          toast.loading("Thao tác đang được xử lý ... ", {
            toastId: toastLoadingId,
          })
          setLoadingImage(true)
        }}
        onError={onError}
        onSuccess={onSuccess}
      />
    </label>
  )
}

export default ChooseFileReason

function AddImageBtn() {
  const { t } = useTranslation()
  return (
    <div className="w-full h-[200px] border border-dashed border-[#AD98E6] rounded flex flex-col items-center justify-center">
      <CameraIcon />
      <div className="px-4 py-3 font-medium border rounded text-primary border-primary">
        {t("add_image")}
      </div>
    </div>
  )
}
