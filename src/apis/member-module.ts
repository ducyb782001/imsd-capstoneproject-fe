import { getListMemberUrl, getMemberDetailUrl } from "../constants/APIConfig"
import { convertObjectToQueryString, requestAPI } from "../lib/api"

export const getListMember = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getListMemberUrl}${queryString}`,
  })
}

export const getMemberDetail = (memberId) => {
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}`,
  })
}

export const getMemberBalance = (memberId) => {
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/balances`,
  })
}

export const getMemberCouponUsage = (memberId) => {
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/coupon-usage`,
  })
}

export const getMemberTier = (memberId) => {
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/tier`,
  })
}

export const getMembershipUsage = (memberId) => {
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/membership-usage`,
  })
}

export const getMemberLoyaltyPointTx = (memberId, searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/loyalty-point-transactions${queryString}`,
  })
}

export const getMembershipCardTx = (memberId, searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/membership-card-transactions${queryString}`,
  })
}

export const getMembershipUsageTx = (memberId, searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/membership-usage-transactions${queryString}`,
  })
}

export const getMemberCouponUsageTx = (memberId, searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/coupon-usage-transactions${queryString}`,
  })
}

export const getMemberCouponRedeemTx = (memberId, searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getMemberDetailUrl}${memberId}/coupon-transactions${queryString}`,
  })
}
