import {
  allStocktakeUrl,
  approveStockTakeUrl,
  createStockTakeUrl,
  denyStockTakeUrl,
  detailStockTakeUrl,
} from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListStockTakeProduct = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${allStocktakeUrl}${queryString}`,
  })
}

export const createStockTakeProduct = (newStockTaketProduct) =>
  postAPI({
    url: createStockTakeUrl,
    data: newStockTaketProduct,
  })

export const getDetailStockTakeProduct = (stockTakeId) => {
  return requestAPI({
    url: `${detailStockTakeUrl}?stocktakeid=${stockTakeId}`,
  })
}

export const approveStockTakeProduct = (stockTakeId) => {
  return postAPI({
    url: `${approveStockTakeUrl}?stocktakeid=${stockTakeId}`,
  })
}

export const denyStockTakeProduct = (stockTakeId) => {
  return postAPI({
    url: `${denyStockTakeUrl}?stocktakeid=${stockTakeId}`,
  })
}
