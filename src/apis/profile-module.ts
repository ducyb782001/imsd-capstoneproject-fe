import { updateProfileUrl } from "../constants/APIConfig"
import { patchAPI } from "../lib/api"

// Chi danh cho owner
export const updateProfile = (dataUpdate) =>
  patchAPI({
    url: updateProfileUrl,
    data: dataUpdate,
  })
