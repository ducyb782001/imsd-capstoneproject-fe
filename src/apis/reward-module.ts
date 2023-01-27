import { rewardUrl } from "../constants/APIConfig"
import {
  convertObjectToQueryString,
  deleteAPI,
  patchAPI,
  postAPI,
  requestAPI,
} from "../lib/api"

export const getListRewards = (searchObj) => {
  const queryString = convertObjectToQueryString(searchObj)
  return requestAPI({
    url: `${rewardUrl}${queryString}`,
  })
}

export const addNewReward = (newReward) =>
  postAPI({
    url: rewardUrl,
    data: newReward,
  })

export const updateReward = (rewardId, newReward) =>
  patchAPI({
    url: `${rewardUrl}${rewardId}`,
    data: newReward,
  })

export const deleteReward = (rewardId) => {
  return deleteAPI({
    url: `${rewardUrl}${rewardId}`,
  })
}

export const getRewardDetails = (rewardId) => {
  return requestAPI({
    url: `${rewardUrl}${rewardId}`,
  })
}
