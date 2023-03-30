// export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Dev baseUrl
// export const baseUrl = `https://imsdservice.azurewebsites.net/api`

export const baseUrl = `http://lamluoihoc-001-site1.etempurl.com/api`

// export const baseUrl = `https://localhost:7265/api`

// New city, district API
export const provinceUrl = `https://vn-public-apis.fpo.vn`

//auth url

export const loginUrl = `${baseUrl}/Authentication/Login`

export const sendEmailUrl = `${baseUrl}/Authentication/ResetPasswordByEmail?email=`

export const resetPassword = `${baseUrl}/Authentication/ResetPassword?token=`

export const signUpUrl = `${baseUrl}/Authentication/SignUp`

export const confirmEmailUrl = `${baseUrl}/Authentication/ConfirmEmail`

export const logoutUrl = `${baseUrl}/Logout`

export const meUrl = `${baseUrl}/Users/GetUserDetail`

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

export const getStaffDetailUrl = `${baseUrl}/Users/GetUserDetail`

export const activeStaffUrl = `${baseUrl}/Users/Activate`

export const deactiveStaffUrl = `${baseUrl}/Users/Deactivate`

export const createStaffUrl = `${baseUrl}/Users/CreateStaff`

export const updateStaffUrl = `${baseUrl}/Users/UpdateStaff`

export const updateProfileUrl = `${baseUrl}/Users/UpdateProfile`

export const changePasswordUrl = `${baseUrl}/Users/ChangePassword`

// Import product

export const allImportProductUrl = `${baseUrl}/Import/GetImportOrder`

export const importProductUrl = `${baseUrl}/Import/CreateImportOrder`

export const importProductDetailUrl = `${baseUrl}/Import/GetImportDetail`

export const getImportProductDetailUrl = `${baseUrl}/Import/GetDetail`

export const approveImportDetailUrl = `${baseUrl}/Import/ApproveImport`

export const importImportDetailUrl = `${baseUrl}/Import/Import`

export const denyImportDetailUrl = `${baseUrl}/Import/DenyImport`

export const updateImportUrl = `${baseUrl}/Import/UpdateImportOrder`

// Export product

export const exportProductUrl = `${baseUrl}/Export/CreateExportOrder`

export const allExportProductUrl = `${baseUrl}/Export/GetExportOrder`

export const detailExportProductUrl = `${baseUrl}/Export/GetExportDetail`

export const detailProductExportProductUrl = `${baseUrl}/Export/GetDetail`

export const approveExportProductUrl = `${baseUrl}/Export/ApproveExport`

export const exportExportProductUrl = `${baseUrl}/Export/Export`

export const denyExportProductUrl = `${baseUrl}/Export/DenyImport`

export const updateExportProductUrl = `${baseUrl}/Export/UpdateExportOrder`

// stocktake product

export const allStocktakeUrl = `${baseUrl}/Stocktake/Get`

export const createStockTakeUrl = `${baseUrl}/Stocktake/Create`

export const detailProductStockTakeUrl = `${baseUrl}/Stocktake/GetDetail`

export const detailStockTakeUrl = `${baseUrl}/Stocktake/GetStockTakeDetail`

export const approveStockTakeUrl = `${baseUrl}/Stocktake/Stocktake`

export const denyStockTakeUrl = `${baseUrl}/Stocktake/Cancel`

export const updateStockTakeUrl = `${baseUrl}/Stocktake/Update`

// Return

export const returnGoodsUrl = `${baseUrl}/Returns`

// Dashboard

export const getDashboardDataUrl = `${baseUrl}/Dashboard/GetData`

export const getDashboardChartDataUrl = `${baseUrl}/Dashboard/GetChartData`

export const getDashboardDataByTimeUrl = `${baseUrl}/Dashboard/GetDataByTimePeriod`
