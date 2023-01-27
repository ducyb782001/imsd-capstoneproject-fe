export function basePagination(c: number, m: number) {
  const currentPage = c
  const lastPage = m
  const delta = 2
  const left = currentPage - delta
  const right = currentPage + delta + 1

  const range = []
  const rangeWithDots = []

  let l

  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push("...")
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}
