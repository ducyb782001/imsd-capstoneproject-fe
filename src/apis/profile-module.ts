import { meUrl } from "../constants/APIConfig"
import { patchAPI } from "../lib/api"

export const updateProfile = (dataUpdate) =>
  patchAPI({
    url: meUrl,
    data: dataUpdate,
  })
