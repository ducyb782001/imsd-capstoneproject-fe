export function shortenAddress(address: string = "", length: number = 4) {
  return (
    address &&
    `${address.substring(0, 6)}...${address.substring(address.length - length)}`
  )
}
