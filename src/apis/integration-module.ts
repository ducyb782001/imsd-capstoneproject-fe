import { integreationUrl } from "../constants/APIConfig"
import { postAPI, requestAPI } from "../lib/api"

export const getIntegration = () => {
  return requestAPI({
    url: integreationUrl,
  })
}

export const generateAPIKey = () => {
  return postAPI({
    url: `${integreationUrl}/generate-api-key`,
  })
}
