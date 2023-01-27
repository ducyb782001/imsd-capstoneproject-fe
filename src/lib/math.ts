import BigNumber from "bignumber.js"

export type BigNumberValue = string | number | BigNumber

export const BigNumberZD = BigNumber.clone({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
})

// BigNumber.set({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_DOWN });

export function valueToBigNumber(amount: BigNumberValue): BigNumber {
  return new BigNumber(amount)
}

export function valueToZDBigNumber(amount: BigNumberValue): BigNumber {
  return new BigNumberZD(amount)
}

const bn10 = new BigNumber(10)

const bn10PowLookup: { [key: number]: BigNumber } = {}

/**
 * It's a performance optimized version of 10 ** x, which essentially memoizes previously used pows and resolves them as lookup.
 * @param decimals
 * @returns 10 ** decimals
 */
export function pow10(decimals: number): BigNumber {
  if (!bn10PowLookup[decimals]) bn10PowLookup[decimals] = bn10.pow(decimals)
  return bn10PowLookup[decimals]
}

export function normalize(n: BigNumberValue, decimals: number): string {
  return valueToBigNumber(n).dividedBy(pow10(decimals)).toString(10)
}

export function add(
  a: number | string | BigNumber,
  b: number | string | BigNumber,
) {
  return new BigNumber(a).plus(new BigNumber(b))
}

export function sub(
  a: number | string | BigNumber,
  b: number | string | BigNumber,
) {
  return new BigNumber(a).minus(new BigNumber(b))
}

export function mul(
  a: number | string | BigNumber,
  b: number | string | BigNumber,
) {
  return new BigNumber(a).multipliedBy(new BigNumber(b))
}

export function div(
  a: number | string | BigNumber,
  b: number | string | BigNumber,
) {
  return new BigNumber(a).dividedBy(new BigNumber(b))
}

export function addMultiples(values: number[]) {
  return values.reduce((result, cur) => {
    return new BigNumber(result).plus(new BigNumber(cur ?? 0)).toNumber()
  }, 0)
}

export function isNumeric(str: string) {
  if (typeof str != "string") return false // we only process strings!
  return (
    !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}
