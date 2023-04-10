import {
  changePasswordUrl,
  logoutUrl,
  meUrl,
  resendEmailUrl,
} from "../constants/APIConfig"
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

export const resendEmail = (email) => {
  return postAPI({
    url: `${resendEmailUrl}?email=${email}`,
  })
}
