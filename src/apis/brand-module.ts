import { getBrandDetailUrl, getCountryAndCityUrl } from "../constants/APIConfig"
import { patchAPI, requestAPI } from "../lib/api"

export const getBrandDetail = () => {
  return requestAPI({
    url: `${getBrandDetailUrl}`,
  })
}

export const getCountryAndCity = () => {
  return requestAPI({
    url: getCountryAndCityUrl,
  })
}

export const updateBrand = (newBrand) =>
  patchAPI({
    url: `${getBrandDetailUrl}`,
    data: newBrand,
  })
