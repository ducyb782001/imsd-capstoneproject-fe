import { tierConfigUrl, tierUrl } from "../constants/APIConfig"
import { deleteAPI, patchAPI, postAPI, requestAPI } from "../lib/api"

export const getTier = () => {
  return requestAPI({
    url: tierUrl,
  })
}

export const getTierDetail = (tierId) => {
  return requestAPI({
    url: `${tierUrl}${tierId}`,
  })
}

export const updateTierDetail = (tierId, newDetails) => {
  return patchAPI({
    url: `${tierUrl}${tierId}`,
    data: newDetails,
  })
}

export const getListTierConfig = () => {
  return requestAPI({
    url: tierConfigUrl,
  })
}

export const addNewConfig = (newConfig) => {
  return postAPI({
    url: tierConfigUrl,
    data: newConfig,
  })
}

export const updateConfig = (configId, newConfig) => {
  return patchAPI({
    url: `${tierConfigUrl}${configId}`,
    data: newConfig,
  })
}

export const deleteConfig = (configId) => {
  return deleteAPI({
    url: `${tierConfigUrl}${configId}`,
  })
}
