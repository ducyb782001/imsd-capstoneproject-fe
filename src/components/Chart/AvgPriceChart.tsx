import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import YearTimeDropdown from "./YearTimeDropdown"
import { useTranslation } from "react-i18next"

Chart.register(CategoryScale)

function AvgPriceChart({
  dashboardData,
  selectedYear,
  setSelectedYear,
  listYear,
}) {
  const [chartData, setChartData] = useState<any>()
  const { t } = useTranslation()

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
            label: t("in_stock"),
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
        <p>{t("inventory_value_year")}</p>
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
