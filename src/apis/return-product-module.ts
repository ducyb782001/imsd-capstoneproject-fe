import { returnGoodsUrl } from "../constants/APIConfig"
import { convertObjectToQueryString, postAPI, requestAPI } from "../lib/api"

export const createReturnGoods = (newImportProduct) => {
  return postAPI({
    url: `${returnGoodsUrl}/Create`,
    data: newImportProduct,
  })
}

export const getListReturnGoods = (queryObject) => {
  const queryString = convertObjectToQueryString(queryObject)
  return requestAPI({
    url: `${returnGoodsUrl}/Get${queryString}`,
  })
}

export const getDetailReturnImport = (returnId) => {
  return requestAPI({
    url: `${returnGoodsUrl}/GetReturnsDetail?returnId=${returnId}`,
  })
}

export const getListProductAvailable = (queryObject) => {
  const queryString = convertObjectToQueryString(queryObject)
  return requestAPI({
    url: `${returnGoodsUrl}/GetAvailable${queryString}`,
  })
}

export const getDetailReturnBycode = (returnCode) => {
  return requestAPI({
    url: `${returnGoodsUrl}/GetDetail?returncode=${returnCode}`,
  })
}
