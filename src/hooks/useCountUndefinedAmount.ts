export const countUndefinedOrEmptyAmount = (arr: any[]) => {
  let count = 0
  arr.forEach((obj) => {
    if (obj.amount === undefined || obj.amount === "") {
      count++
    }
  })
  return count
}
