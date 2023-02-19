import { allImportProductUrl, importProductUrl } from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListImportProduct = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return postAPI({
    url: `${allImportProductUrl}${queryString}`,
  })
}

export const createImportProduct = (newImportProduct) =>
  postAPI({
    url: importProductUrl,
    data: newImportProduct,
  })
