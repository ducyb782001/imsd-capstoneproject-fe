import { uploadImageUrl } from "../constants/APIConfig"
import { postAPI } from "../lib/api"

export const uploadImage = (newImage) => {
  return postAPI({
    url: `${uploadImageUrl}`,
    data: newImage,
  })
}
