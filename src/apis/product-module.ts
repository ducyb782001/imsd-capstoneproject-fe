import {
  allProductUrl,
  detailProductUrl,
  postProductUrl,
  editProductUrl,
} from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListProduct = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${allProductUrl}${queryString}`,
  })
}

export const addNewProduct = (newProduct) =>
  postAPI({
    url: postProductUrl,
    data: newProduct,
  })

export const getProductDetail = (productId) => {
  return requestAPI({
    url: `${detailProductUrl}?prodId=${productId}`,
  })
}

export const getListExportProduct = (queryObject) => {
  const queryString = convertObjectToQueryString(queryObject)

  return requestAPI({
    url: `${allProductUrl}${queryString}`,
  })
}

export const getListExportProductBySupplier = (queryObject) => {
  const queryString = convertObjectToQueryString(queryObject)

  return requestAPI({
    url: `${allProductUrl}${queryString}`,
  })
}

export const updateProduct = (editedProduct) =>
  patchAPI({
    url: editProductUrl,
    data: editedProduct,
  })
