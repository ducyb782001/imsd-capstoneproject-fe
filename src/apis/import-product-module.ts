import { importProductUrl } from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const createImportProduct = (newImportProduct) =>
  postAPI({
    url: importProductUrl,
    data: newImportProduct,
  })
