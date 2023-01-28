import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import IconCarretDown from "./icons/IconCarretDown"
import IconCloseDialog from "./icons/IconCloseDialog"
import IconHamberger from "./icons/IconHamberger"
import PaginationLeft from "./icons/PaginationLeft"

function Home(props) {
  const [balance, setBalance] = useState("")
  const [amount, setAmount] = useState("")

  return <div className="text-blue text-xl font-bold">Test Home</div>
}

export default Home
