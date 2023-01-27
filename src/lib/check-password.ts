export function checkPassword(newPassword, confirmPassword) {
  var regex =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~,!,@,#,$,%,^,&,*,(,),<,>,?,/]).{8,}/

  const validatePassword = regex.test(newPassword)

  const wightConfirmPassword = newPassword === confirmPassword

  return validatePassword && wightConfirmPassword
}
