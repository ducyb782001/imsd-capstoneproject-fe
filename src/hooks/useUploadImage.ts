import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { uploadImage } from "../apis/upload-image-module"
import { useTranslation } from "react-i18next"

const TOAST_UPLOAD_CUSTOM_ID = "toast-upload-custom-id"

function useUploadImage() {
  const { t } = useTranslation()
  const [imageUpload, setImageUpload] = useState()
  const [imageUrlResponse, setImageUrlResponse] = useState<string>("")

  const handleUploadImage = (event) => {
    const target = event.target || event.srcElement
    if (target.value.length === 0) {
      console.log("Cancel was hit, no file selected!")
    } else {
      setImageUpload(target.files[0])
    }
  }

  useEffect(() => {
    if (imageUpload) {
      const formData = new FormData()
      formData.append("image", imageUpload)
      // @ts-ignore
      uploadImageMutation.mutate(formData)
    }
  }, [imageUpload])

  const uploadImageMutation = useMutation(
    async (imageUpload) => {
      return await uploadImage(imageUpload)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          setImageUrlResponse(data?.data)
          toast.success(t("upload_image_success"))
        } else {
          console.log("Error: ", data)
          toast.error(data?.response?.data || t("error_occur"))
        }
      },
      onError: (err: any) => {
        console.log("Upload image error", err?.message)
        toast.error(err?.response?.data?.message || err?.message)
      },
    },
  )

  useEffect(() => {
    if (uploadImageMutation.isLoading) {
      toast.loading(t("operation_process"), {
        toastId: TOAST_UPLOAD_CUSTOM_ID,
      })
    } else {
      toast.dismiss(TOAST_UPLOAD_CUSTOM_ID)
    }
  }, [uploadImageMutation.isLoading])

  return { imageUrlResponse, handleUploadImage }
}

export default useUploadImage
