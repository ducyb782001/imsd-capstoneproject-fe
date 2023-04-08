export function convertSecondsToReadableObject(seconds: number) {
  seconds = seconds || 0
  seconds = Number(seconds)
  seconds = Math.abs(seconds)

  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  let parts = {}

  if (d >= 0) {
    parts = { ...parts, day: d }
  }

  if (h >= 0) {
    parts = { ...parts, hours: h }
  }

  if (m >= 0) {
    parts = { ...parts, min: m }
  }

  if (s >= 0) {
    parts = { ...parts, second: s }
  }

  return parts
}

export function convertSecondsToReadableString(seconds: number) {
  seconds = seconds || 0
  seconds = Number(seconds)
  seconds = Math.abs(seconds)

  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const parts = []

  if (d > 0) {
    parts.push(d + " day" + (d > 1 ? "s" : ""))
  }

  if (h > 0) {
    parts.push(h + " hour" + (h > 1 ? "s" : ""))
  }

  if (m > 0) {
    parts.push(m + " minute" + (m > 1 ? "s" : ""))
  }

  if (s > 0) {
    parts.push(s + " second" + (s > 1 ? "s" : ""))
  }

  return parts.join(", ")
}

export function uppercaseFirstChar(string) {
  return string?.charAt(0).toUpperCase() + string?.slice(1).toLowerCase()
}

export function getFirstChar(string) {
  return string?.charAt(0).toUpperCase()
}

export function getOneMonthFromNow() {
  const today = new Date()
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  )
  return { endDate: today.toISOString(), startDate: oneMonthAgo.toISOString() }
}

export function addValueToString(value: string, string: string) {
  let res = ""

  if (string == "") {
    res = value
  } else if (string !== "" && !string.includes(value)) {
    res = string + `,${value}`
  } else if (string.includes(`,${value},`) || string.includes(`,${value}`)) {
    res = string.replace(`,${value}`, "")
  } else if (string.includes(`${value},`)) {
    res = string.replace(`${value},`, "")
  } else if (string == value) {
    res = ""
  }
  return res
}

export function checkDisableApplyFilter(filterApplied, condition, filterValue) {
  if (!filterApplied) {
    return true
  } else if (
    filterApplied.id == "type" ||
    filterApplied.id == "txType" ||
    filterApplied.id == "registrationDate" ||
    filterApplied.id == "date" ||
    filterApplied.id == "activeDate" ||
    filterApplied.id == "expireDate"
  ) {
    return false
  } else if (!condition || !filterValue) {
    return true
  } else {
    return false
  }
}

export function checkDisableApplyRewardFilter(
  filterApplied,
  condition,
  filterValue,
) {
  if (!filterApplied) {
    return true
  } else if (filterApplied.id == "date") {
    return false
  } else if (!condition || !filterValue) {
    return true
  } else {
    return false
  }
}

export function checkStringLength(str: string, length: number) {
  if (str?.length > length) {
    return true
  }
  return false
}
