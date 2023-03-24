import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import YearTimeDropdown from "./YearTimeDropdown"
import BigNumber from "bignumber.js"
Chart.register(CategoryScale)

const labels = ["January", "February", "March", "April", "May", "June"]

const data = {
  labels: labels,
  datasets: [
    {
      label: "",
      backgroundColor: "#3AD34930",
      borderColor: "#3AD349",
      data: [0, 10, 5, 4, 20, 30, 45],
      fill: true,
    },
  ],
}

function AvgPriceChart({
  dashboardData,
  selectedYear,
  setSelectedYear,
  listYear,
}) {
  const [chartData, setChartData] = useState<any>()

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,
        },
        // to remove the x-axis grid
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: true,
        },
        // to remove the x-axis grid
        grid: {
          display: true,
        },
      },
    },
  }

  useEffect(() => {
    if (dashboardData) {
      const chartLabels = dashboardData?.map((i) => `Tháng ${i?.month}`)
      const chartDataNumber = dashboardData?.map((i) =>
        i?.inventoryValue ? i?.inventoryValue : 0,
      )

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: "Tồn kho",
            backgroundColor: "#696CFF30",
            borderColor: "#696CFF",
            data: chartDataNumber,
            borderWidth: 1,
            hoverBorderWidth: 0,
            fill: true,
            tension: 0.2,
            pointRadius: 3,
            pointBackgroundColor: "#FFFFFF",
            pointBorderColor: "#696CFF",
          },
        ],
      })
    }
  }, [dashboardData])

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between mb-2">
        <p>Giá trị tồn kho theo năm</p>
        <YearTimeDropdown
          listDropdown={listYear}
          showing={selectedYear}
          setShowing={setSelectedYear}
          textDefault="Select year"
        />
      </div>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  )
}

export default AvgPriceChart
