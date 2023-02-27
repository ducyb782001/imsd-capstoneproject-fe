import { convertObjectToQueryString, postAPI, requestAPI } from "../lib/api"
import {
  allExportProductUrl,
  approveExportProductUrl,
  detailExportProductUrl,
  exportExportProductUrl,
  exportProductUrl,
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
