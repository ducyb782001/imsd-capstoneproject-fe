import {
  couponUrl,
  getMintCouponTxUrl,
  getTransferCouponTxUrl,
  mintCouponUrl,
} from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  deleteAPI,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListCoupon = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${couponUrl}${queryString}`,
  })
}

export const addNewCoupon = (newCoupon) =>
  postAPI({
    url: couponUrl,
    data: newCoupon,
  })

export const getCouponDetail = (couponId) => {
  return requestAPI({
    url: `${couponUrl}${couponId}`,
  })
}

export const updateCoupon = (couponId, newCoupon) => {
  return patchAPI({
    url: `${couponUrl}${couponId}`,
    data: newCoupon,
  })
}

export const deleteCoupon = (couponId) => {
  return deleteAPI({
    url: `${couponUrl}${couponId}`,
  })
}

export const publishCoupon = (couponId, dataPublish) => {
  return postAPI({
    url: `${couponUrl}${couponId}/publish`,
    data: dataPublish,
  })
}

export const mintCoupon = (dataMint) => {
  return postAPI({
    url: `${mintCouponUrl}`,
    data: dataMint,
  })
}

export const deactivateCoupon = (couponId) => {
  return postAPI({
    url: `${couponUrl}${couponId}/deactivate`,
  })
}

export const getMintCouponByIdTx = (couponId, searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${couponUrl}${couponId}/mint-coupon-transactions${queryString}`,
  })
}

export const getTransferCouponByIdTx = (couponId, searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${couponUrl}${couponId}/transfer-coupon-transactions${queryString}`,
  })
}
