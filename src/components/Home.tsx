import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AvgPriceChart from "./Chart/AvgPriceChart"
import BarChart from "./Chart/BarChart"
import IconCarretDown from "./icons/IconCarretDown"
import IconCloseDialog from "./icons/IconCloseDialog"
import IconHamberger from "./icons/IconHamberger"
import PaginationLeft from "./icons/PaginationLeft"

function Home(props) {
  const [balance, setBalance] = useState("")
  const [amount, setAmount] = useState("")

  return (
    <div className="text-xl font-bold text-blue">
      <AvgPriceChart />
      <BarChart />
    </div>
  )
}

export default Home
