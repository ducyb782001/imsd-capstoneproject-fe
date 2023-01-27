import {
  getListMintLoyaltyPointTxUrl,
  getListMintMembershipCardTxUrl,
  getListTierUsageTxUrl,
  getListTransferLoyaltyPointTxUrl,
  getListTransferMembershipCardTxUrl,
  getMintCouponTxUrl,
  getTransactionSummaryUrl,
  getTransferCouponTxUrl,
} from "../constants/APIConfig"
import { convertObjectToQueryString, requestAPI } from "../lib/api"

export const getMintLoyaltyPointTx = (queryObj) => {
  const queryString = convertObjectToQueryString(queryObj)
  return requestAPI({
    url: `${getListMintLoyaltyPointTxUrl}${queryString}`,
  })
}

export const getTransferLoyaltyPointTx = (queryObj) => {
  const queryString = convertObjectToQueryString(queryObj)
  return requestAPI({
    url: `${getListTransferLoyaltyPointTxUrl}${queryString}`,
  })
}

export const getMintMembershipCardTx = (queryObj) => {
  const queryString = convertObjectToQueryString(queryObj)
  return requestAPI({
    url: `${getListMintMembershipCardTxUrl}${queryString}`,
  })
}

export const getTransferMembershipCardTx = (queryObj) => {
  const queryString = convertObjectToQueryString(queryObj)
  return requestAPI({
    url: `${getListTransferMembershipCardTxUrl}${queryString}`,
  })
}

export const getTierUsageTx = (queryObj) => {
  const queryString = convertObjectToQueryString(queryObj)
  return requestAPI({
    url: `${getListTierUsageTxUrl}${queryString}`,
  })
}

export const getTransactionSummary = () =>
  requestAPI({
    url: getTransactionSummaryUrl,
  })

export const getMintCouponTx = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getMintCouponTxUrl}${queryString}`,
  })
}

export const getTransferCouponTx = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getTransferCouponTxUrl}${queryString}`,
  })
}
