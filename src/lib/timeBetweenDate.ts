export default function timeBetweenDates(toDate: Date, startDate: Date) {
  const dateEntered = toDate
  const now = startDate
  const difference = dateEntered.getTime() - now.getTime()

  if (difference <= 0) {
    // Timer done
    return
  } else {
    let seconds = Math.floor(difference / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)

    hours %= 24
    minutes %= 60
    seconds %= 60
    return { days, hours, minutes, seconds }
  }
}
