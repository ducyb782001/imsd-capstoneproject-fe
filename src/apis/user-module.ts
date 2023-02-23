import { listStaffUrl } from "../constants/APIConfig"
import { convertObjectToQueryString, requestAPI } from "../lib/api"

export const getListStaff = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${listStaffUrl}${queryString}`,
  })
}
