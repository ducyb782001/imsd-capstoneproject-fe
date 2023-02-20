// export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Dev baseUrl
export const baseUrl = `https://imsdservice.azurewebsites.net/api`

// export const baseUrl = `https://localhost:7265/api`

// City, district, ward
export const countryUrl = `https://provinces.open-api.vn/api`

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
export const editProductUrl = `${baseUrl}/Products/PutProduct`

//Supplier url

export const allSupplierUrl = `${baseUrl}/Suppliers/Get`

export const addSupplierUrl = `${baseUrl}/Suppliers/PostSupplier`

export const getSupplierDetailUrl = `${baseUrl}/Suppliers/GetDetail`

export const editSupplierUrl = `${baseUrl}/Suppliers/PutSupplier`

//Type good

export const allTypeGoodUrl = `${baseUrl}/Categories/Get`

export const addTypeGoodUrl = `${baseUrl}/Categories/PostCategory`

export const getTypeGoodDetailUrl = `${baseUrl}/Categories/GetDetail`

export const editTypeGoodUrl = `${baseUrl}/Categories/PutCategory`

// User
export const listStaffUrl = "/fake-response/list-staff.json"

// Import product

export const allImportProductUrl = `${baseUrl}/Import/GetImportOrder`

export const importProductUrl = `${baseUrl}/Import/CreateImportOrder`
