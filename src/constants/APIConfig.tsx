// export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Dev baseUrl
// export const baseUrl = `https://imsdservice.azurewebsites.net/api`

export const baseUrl = `https://localhost:7265/api`

//auth url

export const loginUrl = `${baseUrl}/Authentication/Login`

export const sendEmailUrl = `${baseUrl}/Authentication/ResetPasswordByEmail?email=`

export const resetPassword = `${baseUrl}/Authentication/ResetPassword?token=`

export const signUpUrl = `${baseUrl}/Authentication/SignUp`

export const confirmEmailUrl = `${baseUrl}/Authentication/ConfirmEmail?token=`

export const logoutUrl = `${baseUrl}/partner/logout`

export const meUrl = `${baseUrl}/partner/profile`

export const changePasswordUrl = `${baseUrl}/partner/change-password`

export const notMeUrl = `${baseUrl}/Authentication/RevokeToken?token=`

//Product url

export const allProductUrl = `${baseUrl}/Products/Get`
export const postProductUrl = `${baseUrl}/Products/PostProduct`
export const detailProductUrl = `${baseUrl}/Products/GetDetail`
