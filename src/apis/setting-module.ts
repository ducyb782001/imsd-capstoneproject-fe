import { settingsUrl } from "../constants/APIConfig"
import { patchAPI, requestAPI } from "../lib/api"

export const getPartnerSetting = () => {
  return requestAPI({
    url: settingsUrl,
  })
}

export const updateSetting = (dataUpdate) =>
  patchAPI({
    url: settingsUrl,
    data: dataUpdate,
  })
