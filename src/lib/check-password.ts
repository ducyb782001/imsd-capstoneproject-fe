export function checkPassword(newPassword) {
  let regex =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~,!,@,#,$,%,^,&,*,(,),<,>,?,/]).{8,}/

  const validatePassword = regex.test(newPassword)

  return validatePassword
}

export function checkSamePassword(newPassword, confirmPassword) {
  const check = newPassword === confirmPassword
  return check
}
