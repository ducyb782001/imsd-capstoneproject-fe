import { provinceUrl } from "../constants/APIConfig"
import { requestAPI } from "../lib/api"

export const getListDistrictByCode = (code) => {
  return requestAPI({
    url: `${provinceUrl}/districts/getByProvince?provinceCode=${code}&limit=-1`,
  })
}

export const getListWardByCode = (code) => {
  return requestAPI({
    url: `${provinceUrl}/wards/getByDistrict?districtCode=${code}&limit=-1`,
  })
}

export const getAllProvinces = () => {
  return requestAPI({
    url: `${provinceUrl}/provinces/getAll?limit=-1`,
  })
}
