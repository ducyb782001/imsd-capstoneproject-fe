export const formatCurrency = (value) => {
  if (value) {
    return parseFloat(value.replace(/,/g, ""))
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}
