import { AllProductUrl } from "../constants/APIConfig"
import { convertObjectToQueryString, postAPI, requestAPI } from "../lib/api"

export const getListProduct = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${AllProductUrl}${queryString}`,
  })
}

export const addNewProduct = (newProduct) =>
  postAPI({
    url: "thay url vao nhe",
    data: newProduct,
  })
