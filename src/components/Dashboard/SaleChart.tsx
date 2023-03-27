import React, { useState } from "react"
import { useQuery } from "react-query"
import { getDashboardChartData } from "../../apis/dashboard-module"
import BarChart from "../Chart/BarChart"

function SaleChart() {
  const [selectedYear, setSelectedYear] = useState({ key: 1, value: 2023 })
  const listYear = [
    { key: 1, value: 2023 },
    { key: 2, value: 2022 },
  ]
  const [isLoading, setIsLoading] = useState(true)
  const [saleChartData, setSaleChartData] = useState<any>()

  useQuery({
    queryKey: ["getDashboardChartData", selectedYear],
    queryFn: async () => {
      setIsLoading(true)
      const response = await getDashboardChartData({
        year: selectedYear?.value,
      })
      setIsLoading(false)
      setSaleChartData(response?.data)
      return response?.data
    },
    enabled: !!selectedYear,
  })

  return (
    <div className="bg-white block-border !rounded-b-lg !rounded-t-none">
      {isLoading && <div className="w-full h-[600px] skeleton-loading" />}
      {saleChartData && (
        <BarChart
          dashboardData={saleChartData}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          listYear={listYear}
        />
      )}
    </div>
  )
}

export default SaleChart
