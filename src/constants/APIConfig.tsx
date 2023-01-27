export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

//auth url
export const loginUrl = `${baseUrl}/partner/login`

export const logoutUrl = `${baseUrl}/partner/logout`

export const meUrl = `${baseUrl}/partner/profile`

export const changePasswordUrl = `${baseUrl}/partner/change-password`

// member module url
export const getListMemberUrl = `${baseUrl}/partner/members`

export const getMemberDetailUrl = `${baseUrl}/partner/members/`

// transaction module url
export const getListMintLoyaltyPointTxUrl = `${baseUrl}/partner/mint-loyalty-point-transactions`

export const getListTransferLoyaltyPointTxUrl = `${baseUrl}/partner/transfer-loyalty-point-transactions`

export const getListMintMembershipCardTxUrl = `${baseUrl}/partner/mint-membership-card-transactions`

export const getListTransferMembershipCardTxUrl = `${baseUrl}/partner/transfer-membership-card-transactions`

export const getListTierUsageTxUrl = `${baseUrl}/partner/tier-usage-transactions`

export const getTransactionSummaryUrl = `${baseUrl}/partner/transaction-summary`

export const getMintCouponTxUrl = `${baseUrl}/partner/mint-coupon-transactions`

export const getTransferCouponTxUrl = `${baseUrl}/partner/transfer-coupon-transactions`

// brand module url
export const getBrandDetailUrl = `${baseUrl}/partner/brand`

export const getCountryAndCityUrl =
  "https://countriesnow.space/api/v0.1/countries/"

// loyalty point module url
export const getLoyaltyPointlUrl = `${baseUrl}/partner/loyalty-point`

// wallet module url
export const getFeeDetailslUrl = `${baseUrl}/partner/wallet/fee-detail`

export const getBlockchainStatslUrl = `${baseUrl}/partner/blockchain/stats`

export const getBalancesUrl = `${baseUrl}/partner/wallet/balances`

export const getMembershipCardsUrl = `${baseUrl}/partner/wallet/membership-cards`

export const mintLoyaltyPointUrl = `${baseUrl}/partner/wallet/mint-loyalty-point`

export const mintMembershipCardUrl = `${baseUrl}/partner/wallet/mint-membership-card`

export const getWalletTransactionLogsUrl = `${baseUrl}/partner/wallet/transaction-logs`

export const getMintLoyaltyPointsRateUrl = `${baseUrl}/partner/wallet/mint-rate`

export const getTransactionDetailUrl = `${baseUrl}/partner/transactions/`

// setting module url
export const settingsUrl = `${baseUrl}/partner/settings`

// tier module url
export const tierUrl = `${baseUrl}/partner/tiers/`

export const tierConfigUrl = `${baseUrl}/partner/tier-configs/`

// reward module url

export const rewardUrl = `${baseUrl}/partner/rewards/`

// integration module url

export const integreationUrl = `${baseUrl}/partner/integration`

// membership card module url

export const membershipCardUrl = `${baseUrl}/partner/membership-cards`

export const membershipCardSummaryUrl = `${baseUrl}/partner/membership-cards/summary`

// coupon module

export const couponUrl = `${baseUrl}/partner/coupon-types/`

export const mintCouponUrl = `${baseUrl}/partner/coupons/mint`
