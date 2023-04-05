import React from "react"
import CameraIcon from "./icons/CameraIcon"
import UploadIcon from "./icons/UploadIcon"
import { IKUpload } from "imagekitio-react"
import Loading from "./Loading"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

function AddImage({
  children,
  imageUploaded,
  onError,
  onSuccess,
  className = "input-img",
  loadingImage = false,
  setLoadingImage,
  toastLoadingId = "",
}) {
  return (
    <label
      // htmlFor="input-file"
      className={`cursor-pointer ${className}`}
    >
      {loadingImage ? (
        <div className="w-full min-h-[176px] flex items-center justify-center">
          <Loading />
        </div>
      ) : imageUploaded ? (
        <div className="flex flex-col items-center justify-center w-max">
          {children}
        </div>
      ) : (
        <div>
          <AddImageBtn />
        </div>
      )}
      <IKUpload
        // onUploadStart={(file) => {
        //   if (file.size > 5242880) {
        //     // 5 MB in bytes
        //     toast.error("File size exceeded 5 MB limit")
        //     return false // stop the upload process
        //   }
        //   // continue with the upload
        //   return true
        // }}
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

export default AddImage

function AddImageBtn() {
  const { t } = useTranslation()
  return (
    <div className="w-[200px] h-[200px] border border-dashed border-[#AD98E6] rounded flex flex-col items-center justify-center">
      <CameraIcon />
      <div className="px-4 py-3 font-medium border rounded text-primary border-primary">
        {t("add_image")}
      </div>
    </div>
  )
}
