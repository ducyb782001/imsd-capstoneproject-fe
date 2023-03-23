import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import YearTimeDropdown from "./YearTimeDropdown"
import BigNumber from "bignumber.js"
Chart.register(CategoryScale)

const data = {
  labels: [
    "Boston",
    "Worcester",
    "Springfield",
    "Lowell",
    "Cambridge",
    "New Bedford",
  ],
  datasets: [
    {
      label: "Population",
      data: [617594, 181045, 153060, 106519, 105162, 95072],
      //   backgroundColor: "green",
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(255, 99, 132, 0.6)",
      ],
      borderWidth: 1,
      borderColor: "#777",
      hoverBorderWidth: 3,
      hoverBorderColor: "#000",
    },
  ],
}

function BarChart({ dashboardData, selectedYear, setSelectedYear, listYear }) {
  const [chartData, setChartData] = useState<any>()

  useEffect(() => {
    if (dashboardData) {
      const chartLabels = dashboardData?.map((i) => `Tháng ${i?.month}`)
      const chartDataNumber = dashboardData?.map((i) =>
        i?.profit ? i?.profit : 0,
      )

      const chartColor = chartDataNumber?.map((i) =>
        new BigNumber(i).isGreaterThanOrEqualTo(BigNumber(0))
          ? "#696CFF70"
          : "#F13535",
      )

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: "Doanh thu",
            backgroundColor: chartColor,
            data: chartDataNumber,
            borderWidth: 0,
            hoverBorderWidth: 0,
          },
        ],
      })
    }
  }, [dashboardData])

  const options = {
    scales: {
      x: {
        ticks: {
          display: true,
          color: "#566A7F",
        },
        // to remove the x-axis grid
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: true,
          color: "#566A7F",
        },
        // to remove the x-axis grid
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
    },
    tooltips: {
      enabled: true,
    },
  }

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between mb-2">
        <p>Doanh thu bán hàng</p>
        <YearTimeDropdown
          listDropdown={listYear}
          showing={selectedYear}
          setShowing={setSelectedYear}
          textDefault="Select year"
        />
      </div>
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  )
}

export default BarChart
