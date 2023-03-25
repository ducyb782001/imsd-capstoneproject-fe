import { updateProfileUrl } from "../constants/APIConfig"
import { patchAPI } from "../lib/api"

export const updateProfile = (dataUpdate) =>
  patchAPI({
    url: updateProfileUrl,
    data: dataUpdate,
  })
