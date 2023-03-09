import {
  activeStaffUrl,
  createStaffUrl,
  deactiveStaffUrl,
  getStaffDetailUrl,
  listStaffUrl,
  updateExportProductUrl,
  updateStaffUrl,
} from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListStaff = () => {
  return requestAPI({
    url: `${listStaffUrl}?offset=0&limit=1000`,
  })
}

export const getAllStaff = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${listStaffUrl}${queryString}`,
  })
}

export const createStaff = (newExportProduct) => {
  return postAPI({
    url: createStaffUrl,
    data: newExportProduct,
  })
}

export const activeStaffModule = (staffId) => {
  return postAPI({
    url: `${activeStaffUrl}?userid=${staffId}`,
  })
}

export const deactiveStaffModule = (staffId) => {
  return postAPI({
    url: `${deactiveStaffUrl}?userid=${staffId}`,
  })
}

export const getDetailStaff = (staffId) => {
  return requestAPI({
    url: `${getStaffDetailUrl}?userid=${staffId}`,
  })
}

export const updateStaff = (updatedStaff) => {
  return patchAPI({
    url: `${updateStaffUrl}`,
    data: updatedStaff,
  })
}
