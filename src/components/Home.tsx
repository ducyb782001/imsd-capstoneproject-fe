import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import IconCarretDown from "./icons/IconCarretDown"
import IconCloseDialog from "./icons/IconCloseDialog"
import IconHamberger from "./icons/IconHamberger"
import PaginationLeft from "./icons/PaginationLeft"
import ModalConnectWallet from "./ModalConnectWallet"

function Home(props) {
  const { account, library } = useWeb3React()
  const [balance, setBalance] = useState("")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    if (account) {
    }
  }, [account])

  return (
    <div>
      <ModalConnectWallet
        label={
          account
            ? `${account.substring(0, 6)}...${account.substring(
                account.length - 4,
              )}`
            : "Connect Wallet"
        }
      />
      balance: {balance}
      <br />
      <br />
    </div>
  )
}

export default Home
