import {
  membershipCardSummaryUrl,
  membershipCardUrl,
} from "../constants/APIConfig"
import { convertObjectToQueryString, requestAPI } from "../lib/api"

export const getListMembershipCard = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${membershipCardUrl}${queryString}`,
  })
}

export const getListMembershipCardSummary = () =>
  requestAPI({
    url: membershipCardSummaryUrl,
  })
