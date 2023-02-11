import { allProductUrl, postProductUrl } from "../constants/APIConfig"
import { convertObjectToQueryString, postAPI, requestAPI } from "../lib/api"

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
