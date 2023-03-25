export function isValidPhoneNumber(phoneNumber: string): boolean {
  const regex = /(84|0[3|5|7|8|9])+([0-9]{7,8})\b/
  return regex.test(phoneNumber)
}

export function isValidGmail(gmail: string): boolean {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return regex.test(gmail)
}
