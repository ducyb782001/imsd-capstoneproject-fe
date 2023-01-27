import { InjectedConnector } from "@web3-react/injected-connector"

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string,
}

const supportedChainIds =
  process.env.NEXT_PUBLIC_PRODUCT_ENV === "mainnet" ? [56] : [97, 5777, 1337]

export const injected = new InjectedConnector({
  supportedChainIds,
})
