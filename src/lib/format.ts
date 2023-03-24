export const formatCurrency = (value) => {
  if (value) {
    return parseFloat(value.replace(/,/g, ""))
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

export const formatPrice = (price: number) => {
  if (price > 1000000) {
    return `${Math.round(price / 1000000)}M`
  } else if (price > 1000) {
    return `${Math.round(price / 1000)}K`
  } else if (price < 0.001) {
    return "<0.001"
  } else {
    return `${Math.round(price * 1000 + Number.EPSILON) / 1000}`
  }
}
