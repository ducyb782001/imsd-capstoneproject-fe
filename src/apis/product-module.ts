import { AllProductUrl } from "../constants/APIConfig";
import { convertObjectToQueryString, requestAPI } from "../lib/api";

export const getListProduct = (searchObj) => {
    const queryString = convertObjectToQueryString(searchObj)
    return requestAPI({
      url: `${AllProductUrl}${queryString}`,
    })
  }