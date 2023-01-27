import { getLoyaltyPointlUrl } from "../constants/APIConfig"
import { requestAPI } from "../lib/api"

export const getLoyaltyPoint = () => {
  return requestAPI({
    url: getLoyaltyPointlUrl,
  })
}
