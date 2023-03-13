import { changePasswordUrl, logoutUrl, meUrl } from "../constants/APIConfig"
import { patchAPI, postAPI, requestAPI } from "../lib/api"

export const getUserData = () =>
  requestAPI({
    url: meUrl,
  })

export const logout = () => postAPI({ url: logoutUrl })

export const changePassword = (password) =>
  patchAPI({
    url: changePasswordUrl,
    data: password,
  })
