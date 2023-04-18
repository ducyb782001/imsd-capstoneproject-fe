import BigNumber from "bignumber.js"

export const countUndefinedOrEmptyAmount = (arr: any[]) => {
  let count = 0
  arr.forEach((obj) => {
    if (obj.amount === undefined || obj.amount === "") {
      count++
    }
  })
  return count
}

export const countQuantity = (stockList: any[]) => {
  let count = 0

  for (const stock of stockList) {
    const currentStock = new BigNumber(stock.currentStock)
    const actualStock = new BigNumber(stock.actualStock)

    if (currentStock.isEqualTo(actualStock)) {
      count++
    }
  }

  return count
}
