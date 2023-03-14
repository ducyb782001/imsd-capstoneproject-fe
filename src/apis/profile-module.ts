import { meUrl, updateStaffUrl } from "../constants/APIConfig"
import { patchAPI } from "../lib/api"

export const updateProfile = (dataUpdate) =>
  patchAPI({
    url: updateStaffUrl,
    data: dataUpdate,
  })
