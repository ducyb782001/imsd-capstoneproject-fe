export const MAX_UINT_AMOUNT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
export const SECONDS_OF_DAY = 86_400
export const SECONDS_OF_YEAR = 31_536_000

export const DEFAULT_REF = "0xE0E7bF8f371Df9A92204e079415022CB7a7502B5"

export const PRODUCT_ENV = process.env.NEXT_PUBLIC_PRODUCT_ENV || "testnet"

export const variants = {
  open: { opacity: 1, height: "auto" },
  collapsed: {
    opacity: 0,
    height: 0,
  },
}
