export type Country = {
  iso2: string
  iso3: string
  country: string
  cities: string[]
}[]

export function search(searchInput: string, list: Country, type: string) {
  let result
  if (!searchInput) {
    return list
  }
  if (searchInput && type.toLowerCase() === "country") {
    result = list.filter((i) =>
      i?.country.toLowerCase().includes(searchInput.toLowerCase()),
    )
  } else if (searchInput && type.toLowerCase() === "city") {
    result = list.filter((i) =>
      // @ts-ignore
      i.toLowerCase().includes(searchInput.toLowerCase()),
    )
  } else {
    result = []
  }
  return result
}
