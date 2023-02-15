import {
  allTypeGoodUrl,
  editTypeGoodUrl,
  getTypeGoodDetailUrl,
  // detailTypeGoodUrl,
  // postTypeGoodtUrl,
  // editTypeGoodUrl,
} from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListTypeGood = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${allTypeGoodUrl}${queryString}`,
  })
}

//   export const addNewProduct = (newProduct) =>
//     postAPI({
//       url: postProductUrl,
//       data: newProduct,
//     })

export const getTypeGoodDetail = (typeId) => {
  return requestAPI({
    url: `${getTypeGoodDetailUrl}?catId=${typeId}`,
  })
}

export const getListExportTypeGood = (searchObj) => {
  return requestAPI({
    url: `${allTypeGoodUrl}?offset=0&limit=1000`,
  })
}
export const updateTypeGood = (editedTypeGood) =>
  patchAPI({
    url: editTypeGoodUrl,
    data: editedTypeGood,
  })
