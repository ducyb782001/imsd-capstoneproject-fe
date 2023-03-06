import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"
import {
  allExportProductUrl,
  approveExportProductUrl,
  denyExportProductUrl,
  detailExportProductUrl,
  exportExportProductUrl,
  exportProductUrl,
  updateExportProductUrl,
} from "../constants/APIConfig"

export const createExportProduct = (newExportProduct) =>
  postAPI({
    url: exportProductUrl,
    data: newExportProduct,
  })

export const getAllExportProduct = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${allExportProductUrl}${queryString}`,
  })
}

export const getDetailExportProduct = (exportProductId) => {
  return requestAPI({
    url: `${detailExportProductUrl}?exportId=${exportProductId}`,
  })
}

export const approveExportProduct = (exportProductId) => {
  return postAPI({
    url: `${approveExportProductUrl}?exportid=${exportProductId}`,
  })
}

export const exportExportProduct = (exportProductId) => {
  return postAPI({
    url: `${exportExportProductUrl}?exportid=${exportProductId}`,
  })
}

export const denyExportProduct = (exportProductId) => {
  return postAPI({
    url: `${denyExportProductUrl}?exportid=${exportProductId}`,
  })
}

export const updateExportProduct = (importProduct) => {
  return patchAPI({
    url: `${updateExportProductUrl}`,
    data: importProduct,
  })
}
