import { changePasswordUrl, meUrl } from "../constants/APIConfig"
import { patchAPI, postAPI } from "../lib/api"

export const updateProfile = (dataUpdate) =>
  patchAPI({
    url: meUrl,
    data: dataUpdate,
  })

export const changePassword = (password) =>
  postAPI({
    url: changePasswordUrl,
    data: password,
  })
