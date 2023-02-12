import {
  allProductUrl,
  detailProductUrl,
  postProductUrl,
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

export const updateProduct = (newProduct) =>
  patchAPI({
    url: `ong thay cai url cua put product vao day nha`,
    data: newProduct,
  })
