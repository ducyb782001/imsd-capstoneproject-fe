import { logoutUrl, meUrl } from "../constants/APIConfig"
import { postAPI, requestAPI } from "../lib/api"

export const getUserData = () =>
  requestAPI({
    url: meUrl,
  })

export const logout = () => postAPI({ url: logoutUrl })
