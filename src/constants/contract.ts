const TESTNET_CONTRACT = {
  BUSD_ADDRESS: "0x3F1a8BEB52737cCC27e952F48d43d859B73C70B3",
}

const MAINNET_CONTRACT = {
  BUSD_ADDRESS: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
}

const contract = () => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  if (chainId === "97") return TESTNET_CONTRACT
  return MAINNET_CONTRACT
}

const CONTRACT = contract()

export default CONTRACT
