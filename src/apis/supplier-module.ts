import {
  addSupplierUrl,
  allSupplierUrl,
  editSupplierUrl,
  getSupplierDetailUrl,
} from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListSupplier = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${allSupplierUrl}${queryString}`,
  })
}

export const addNewSupplier = (newSupplier) =>
  postAPI({
    url: addSupplierUrl,
    data: newSupplier,
  })

export const getSupplierDetail = (supplierId) => {
  return requestAPI({
    url: `${getSupplierDetailUrl}?supId=${supplierId}`,
  })
}

export const getListExportSupplier = (searchObj) => {
  return requestAPI({ url: `${allSupplierUrl}?offset=0&limit=1000` })
}

export const updateSupplier = (editedSupplier) =>
  patchAPI({
    url: editSupplierUrl,
    data: editedSupplier,
  })
