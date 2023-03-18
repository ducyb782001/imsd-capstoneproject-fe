export type Country = {
  iso2: string
  iso3: string
  country: string
  cities: string[]
}[]

export function search(searchInput: string, list: []) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput) {
    result = list.filter((i) =>
      // @ts-ignore
      i?.name.toLowerCase().includes(searchInput.toLowerCase()),
    )
  } else {
    result = []
  }
  return result
}

export function searchName(searchInput: string, list: []) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput) {
    result = list.filter((i) =>
      // @ts-ignore
      i?.userName.toLowerCase().includes(searchInput.toLowerCase()),
    )
  } else {
    result = []
  }
  return result
}

export function searchProduct(searchInput: string, list: []) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput) {
    result = list?.filter(function (item) {
      // @ts-ignore
      if (item.productName.toLowerCase().includes(searchInput.toLowerCase())) {
        return item
      }
      // @ts-ignore
      if (item?.barcode) {
        // @ts-ignore
        if (item.barcode.toLowerCase().includes(searchInput.toLowerCase())) {
          return item
        }
      }
    })
  } else {
    result = []
  }
  return result
}
