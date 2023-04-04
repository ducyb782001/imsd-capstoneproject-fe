import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import YearTimeDropdown from "./YearTimeDropdown"
import BigNumber from "bignumber.js"
Chart.register(CategoryScale)
import { useTranslation } from "react-i18next"

function BarChart({ dashboardData, selectedYear, setSelectedYear, listYear }) {
  const [chartData, setChartData] = useState<any>()
  const { t } = useTranslation()

  useEffect(() => {
    if (dashboardData) {
      const chartLabels = dashboardData?.map((i) => `Tháng ${i?.month}`)
      const chartDataNumber = dashboardData?.map((i) =>
        i?.profit ? i?.profit : 0,
      )

      const chartColor = chartDataNumber?.map((i) =>
        new BigNumber(i).isGreaterThanOrEqualTo(BigNumber(0))
          ? "#696CFF70"
          : "#F1353560",
      )

      setChartData({
        labels: [
          t("month.Jan"),
          t("month.Feb"),
          t("month.Mar"),
          t("month.Apr"),
          t("month.May"),
          t("month.Jun"),
          t("month.Jul"),
          t("month.Aug"),
          t("month.Sep"),
          t("month.Oct"),
          t("month.Nov"),
          t("month.Dec"),
        ],
        datasets: [
          {
            label: t("revenue"),
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
        <p>{t("sale_revenue")}</p>
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
