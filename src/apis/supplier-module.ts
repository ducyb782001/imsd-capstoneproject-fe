import {
  allTypeGoodUrl,
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

//   export const getProductDetail = (productId) => {
//     return requestAPI({
//       url: `${detailProductUrl}?prodId=${productId}`,
//     })
//   }

export const getListExportTypeGood = (searchObj) => {
  return requestAPI({
    url: `${allTypeGoodUrl}?offset=0&limit=1000&catId=0&supId=0`,
  })
}
//   export const updateProduct = (editedProduct) =>
//     patchAPI({
//       url: editProductUrl,
//       data: editedProduct,
//     })
