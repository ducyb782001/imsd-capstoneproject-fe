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
      i?.userName?.toLowerCase().includes(searchInput.toLowerCase()),
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

export function searchExportCode(searchInput: string, list: []) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput) {
    result = list.filter((i) =>
      // @ts-ignore
      i?.exportCode.toLowerCase().includes(searchInput.toLowerCase()),
    )
  } else {
    result = []
  }
  return result
}

export function searchImportCode(searchInput: string, list: []) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput) {
    // result = list.filter((i) =>
    //   // @ts-ignore
    //   i?.importCode.toLowerCase().includes(searchInput.toLowerCase()),
    // )

    result = list?.filter(function (item) {
      // @ts-ignore
      if (item.importCode.toLowerCase().includes(searchInput.toLowerCase())) {
        return item
      }
      // @ts-ignore
      if (item?.supplier?.supplierName) {
        if (
          // @ts-ignore
          item?.supplier?.supplierName
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        ) {
          return item
        }
      }
      // @ts-ignore
      if (item?.supplier?.supplierPhone) {
        if (
          // @ts-ignore
          item?.supplier?.supplierPhone
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        ) {
          return item
        }
      }
    })
  } else {
    result = []
  }
  return result
}

export function searchBySupplierName(searchInput: string, list: []) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput) {
    result = list?.filter(function (item) {
      // @ts-ignore
      if (item.supplierName.toLowerCase().includes(searchInput.toLowerCase())) {
        return item
      }
      // @ts-ignore
      if (item?.supplierPhone) {
        if (
          // @ts-ignore
          item.supplierPhone.toLowerCase().includes(searchInput.toLowerCase())
        ) {
          return item
        }
      }
    })
  } else {
    result = []
  }
  return result
}

export function searchByCategoryName(searchInput: string, list: []) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput) {
    result = list.filter((i) =>
      // @ts-ignore
      i?.categoryName.toLowerCase().includes(searchInput.toLowerCase()),
    )
  } else {
    result = []
  }
  return result
}
