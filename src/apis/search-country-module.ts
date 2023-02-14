import { countryUrl } from "../constants/APIConfig"
import { requestAPI } from "../lib/api"

export const getListCity = () => {
  return requestAPI({
    url: `${countryUrl}/p`,
  })
}

export const getListDistrictByCode = (code) => {
  return requestAPI({
    url: `${countryUrl}/p/${code}?depth=2`,
  })
}

export const getListWardByCode = (code) => {
  return requestAPI({
    url: `${countryUrl}/d/${code}?depth=2`,
  })
}
