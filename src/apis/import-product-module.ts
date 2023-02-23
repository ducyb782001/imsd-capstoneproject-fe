import {
  allImportProductUrl,
  approveImportDetailUrl,
  denyImportDetailUrl,
  importImportDetailUrl,
  importProductDetailUrl,
  importProductUrl,
} from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListImportProduct = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${allImportProductUrl}${queryString}`,
  })
}

export const createImportProduct = (newImportProduct) =>
  postAPI({
    url: importProductUrl,
    data: newImportProduct,
  })

export const getDetailImportProduct = (importProductId) => {
  return requestAPI({
    url: `${importProductDetailUrl}?importid=${importProductId}`,
  })
}

export const approveImportProduct = (importProductId) => {
  return postAPI({
    url: `${approveImportDetailUrl}?importid=${importProductId}`,
  })
}

export const importImportProduct = (importProductId) => {
  return postAPI({
    url: `${importImportDetailUrl}?importid=${importProductId}`,
  })
}

export const denyImportProduct = (importProductId) => {
  return postAPI({
    url: `${denyImportDetailUrl}?importid=${importProductId}`,
  })
}
