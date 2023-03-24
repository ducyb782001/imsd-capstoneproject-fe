import {
  getDashboardChartDataUrl,
  getDashboardDataByTimeUrl,
  getDashboardDataUrl,
} from "../constants/APIConfig"
import { convertObjectToQueryString, requestAPI } from "../lib/api"

export const getDashBoardData = () => {
  return requestAPI({
    url: `${getDashboardDataUrl}`,
  })
}

export const getDashboardChartData = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getDashboardChartDataUrl}${queryString}`,
  })
}

export const getDashboardByTime = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${getDashboardDataByTimeUrl}${queryString}`,
  })
}
