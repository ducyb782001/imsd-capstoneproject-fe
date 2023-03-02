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

export const getListExportProduct = () => {
  return requestAPI({
    url: `${allProductUrl}?offset=0&limit=1000&catId=0&supId=0`,
  })
}
export const getListExportProductBySupplier = (supId) => {
  return requestAPI({
    url: `${allProductUrl}?offset=0&limit=1000&catId=0&supId=${supId}`,
  })
}
export const updateProduct = (editedProduct) =>
  patchAPI({
    url: editProductUrl,
    data: editedProduct,
  })
