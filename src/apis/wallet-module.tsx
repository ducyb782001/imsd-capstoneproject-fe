import {
  getBalancesUrl,
  getBlockchainStatslUrl,
  getFeeDetailslUrl,
  getMembershipCardsUrl,
  getMintLoyaltyPointsRateUrl,
  getTransactionDetailUrl,
  getWalletTransactionLogsUrl,
  mintLoyaltyPointUrl,
  mintMembershipCardUrl,
} from "../constants/APIConfig"
import { convertObjectToQueryString, postAPI, requestAPI } from "../lib/api"

export const getFeeDetail = () => {
  return requestAPI({
    url: getFeeDetailslUrl,
  })
}

export const getBlockchainStats = () => {
  return requestAPI({
    url: getBlockchainStatslUrl,
  })
}

export const getBalances = () => {
  return requestAPI({
    url: getBalancesUrl,
  })
}
export const getMembershipCards = () => {
  return requestAPI({
    url: getMembershipCardsUrl,
  })
}

export const mintLoyaltyPoint = (amount) =>
  postAPI({
    url: mintLoyaltyPointUrl,
    data: amount,
  })

export const mintMembershipCard = (data) =>
  postAPI({
    url: mintMembershipCardUrl,
    data: data,
  })

export const getWalletTransactionLogs = (queryObj) => {
  const queryString = convertObjectToQueryString(queryObj)
  return requestAPI({
    url: `${getWalletTransactionLogsUrl}${queryString}`,
  })
}

export const getMintLoyaltypointsRate = () => {
  return requestAPI({
    url: getMintLoyaltyPointsRateUrl,
  })
}

export const getTransactionDetail = (transactionId, transactionKey) => {
  const queryString = convertObjectToQueryString(transactionKey)

  return requestAPI({
    url: `${getTransactionDetailUrl}${transactionId}${queryString}`,
  })
}
