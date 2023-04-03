import React, { useState } from "react"
import { useQuery } from "react-query"
import { getDashboardChartData } from "../../apis/dashboard-module"
import AvgPriceChart from "../Chart/AvgPriceChart"
import BigNumber from "bignumber.js"

function InventoryChart() {
  const date = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState({
    key: 1,
    value: new BigNumber(date).toFixed(),
  })
  const listYear = [
    { key: 1, value: new BigNumber(date).toFixed() },
    { key: 2, value: new BigNumber(date).minus(1).toFixed() },
  ]
  const [isLoading, setIsLoading] = useState(true)
  const [inventoryChart, setInventoryChart] = useState<any>()

  useQuery({
    queryKey: ["getDashboardChartData", selectedYear],
    queryFn: async () => {
      setIsLoading(true)
      const response = await getDashboardChartData({
        year: selectedYear?.value,
      })
      setIsLoading(false)
      setInventoryChart(response?.data)

      return response?.data
    },
    enabled: !!selectedYear,
  })

  return (
    <div className="bg-white block-border !rounded-b-lg !rounded-t-none">
      {isLoading && <div className="w-full h-[600px] skeleton-loading" />}
      {inventoryChart && (
        <AvgPriceChart
          dashboardData={inventoryChart}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          listYear={listYear}
        />
      )}
    </div>
  )
}

export default InventoryChart
