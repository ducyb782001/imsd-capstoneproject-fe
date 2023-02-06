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
