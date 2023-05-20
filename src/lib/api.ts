import axios from "axios"
import cookie from "cookie"
export interface RequestOptions {
  payload?: any
  body?: any
  headers?: any
}

export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL
}

/**
 * Get the base URL
 * @param path
 */
function getURL(path: string): string {
  const URL = getApiBaseUrl()

  if (URL) {
    return URL + path
  } else {
    throw new Error("URL could not be determined")
  }
}

/**
 * Convert a flat object to a query string
 * @param parameters A flat object
 * @param prefix Defaults to '?'
 */
export const convertObjectToQueryString = (
  parameters: { [key: string]: any } = {},
  prefix: string = "?",
): string => {
  const query: string = Object.keys(parameters)
    .map((key: string) => {
      let value = parameters[key]

      // if (typeof value === "boolean") value = value ? 1 : 0

      return encodeURIComponent(key) + "=" + encodeURIComponent(value)
    })
    .join("&")

  return prefix + query
}

/**
 * Make a HTTP request
 * @param method HTTP method
 * @param path the path to request
 * @param options attach a payload, etc
 */
export const requestApi = async (
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<any> => {
  const url = path.indexOf("http") > -1 ? path : getURL(path)

  const requestOptions: any = {
    method,
    ...options,
  }

  // Set up basic headers
  requestOptions.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Attach the payload
  if (options.payload) {
    requestOptions.body = JSON.stringify(options.payload)
  }

  let response = null

  try {
    response = await fetch(url, requestOptions).then((r: Response) => {
      if (!r.ok) {
        return r.text().then((text) => {
          throw new Error(text)
        })
      }
      return r.json()
    })
  } catch (err) {
    return JSON.parse(err?.message)
  }

  return response
}

/**
 * Make a HTTP GET request
 * @param path the path to get
 * @param options
 */
export const getRequestApi = (
  path: string,
  options: RequestOptions = {},
): Promise<any> => {
  return requestApi("get", path, options)
}

/**
 * Make a HTTP POST request
 * @param path the path to post to
 * @param payload the body to send
 * @param options
 */
export const postRequestApi = (
  path: string,
  payload: any = {},
  options: RequestOptions = {},
): Promise<any> => {
  options = {
    payload,
    headers: {
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
    ...options,
  }
  return requestApi("post", path, options)
}

// optionaly add base url
const client = axios.create({
  url: process.env.NEXT_PUBLIC_BASE_URL,
})

export const requestAPI = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${localStorage?.getItem(
    "token",
  )}`

  const onSuccess = (response) => response
  const onError = (error) => {
    // optionaly catch errors and add some additional logging here

    return error
  }

  return client(options).then(onSuccess).catch(onError)
}

export const postAPI = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${localStorage?.getItem(
    "token",
  )}`

  const onSuccess = (response) => response
  const onError = (error) => {
    // optionaly catch errors and add some additional logging here
    return error
  }

  return client({ method: "post", ...options })
    .then(onSuccess)
    .catch(onError)
}

export const patchAPI = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${localStorage?.getItem(
    "token",
  )}`

  const onSuccess = (response) => response
  const onError = (error) => {
    // optionaly catch errors and add some additional logging here
    return error
  }

  return client({ method: "put", ...options })
    .then(onSuccess)
    .catch(onError)
}

export const deleteAPI = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${localStorage?.getItem(
    "token",
  )}`

  const onSuccess = (response) => response
  const onError = (error) => {
    // optionaly catch errors and add some additional logging here
    return error
  }

  return client({ method: "delete", ...options })
    .then(onSuccess)
    .catch(onError)
}
