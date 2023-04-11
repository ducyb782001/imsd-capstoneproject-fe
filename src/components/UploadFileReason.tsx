import React from "react"
import CameraIcon from "./icons/CameraIcon"
import Loading from "./Loading"
import { useTranslation } from "react-i18next"

function UploadFileReason({
  imageUrlResponse,
  className = "add-file",
  loadingImage = false,
  onChange = null,
  classNameImage = "",
}) {
  return (
    <label className={`cursor-pointer ${className}`}>
      <input onChange={onChange} type="file" accept="image/*" />
      {loadingImage ? (
        <div className="w-full min-h-[176px] flex items-center justify-center">
          <Loading />
        </div>
      ) : imageUrlResponse ? (
        <div className="flex flex-col items-center justify-center w-max">
          <img
            src={imageUrlResponse}
            placeholder="blur"
            alt={"avatar"}
            className={`rounded w-full h-full object-cover ${classNameImage}`}
          />
        </div>
      ) : (
        <div>
          <AddImageBtn />
        </div>
      )}
    </label>
  )
}

export default UploadFileReason

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
