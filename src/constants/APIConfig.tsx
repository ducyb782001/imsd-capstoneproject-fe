// export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Dev baseUrl
export const baseUrl = `https://imsdservice.azurewebsites.net/api`

// export const baseUrl = `http://lamluoihoc-001-site1.etempurl.com/api`

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
export const listStaffUrl = `${baseUrl}/Users/GetUsers`

// Import product

export const allImportProductUrl = `${baseUrl}/Import/GetImportOrder`

export const importProductUrl = `${baseUrl}/Import/CreateImportOrder`

export const importProductDetailUrl = `${baseUrl}/Import/GetImportDetail`

export const approveImportDetailUrl = `${baseUrl}/Import/ApproveImport`

export const importImportDetailUrl = `${baseUrl}/Import/Import`

export const denyImportDetailUrl = `${baseUrl}/Import/DenyImport`

export const updateImportUrl = `${baseUrl}/Import/UpdateImportOrder`

// Export product

export const exportProductUrl = `${baseUrl}/Export/CreateExportOrder`

export const allExportProductUrl = `${baseUrl}/Export/GetExportOrder`

export const detailExportProductUrl = `${baseUrl}/Export/GetExportDetail`

export const approveExportProductUrl = `${baseUrl}/Export/ApproveExport`

export const exportExportProductUrl = `${baseUrl}/Export/Export`

export const denyExportProductUrl = `${baseUrl}/Export/DenyImport`

export const updateExportProductUrl = `${baseUrl}/Export/UpdateExportOrder`
