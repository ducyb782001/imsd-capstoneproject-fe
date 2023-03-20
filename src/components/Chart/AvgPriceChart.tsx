import React from "react"
import { Line } from "react-chartjs-2"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
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

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        display: false,
      },
      // to remove the x-axis grid
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        display: false,
      },
      // to remove the x-axis grid
      grid: {
        display: false,
      },
    },
  },
}
function AvgPriceChart() {
  return (
    <div className="w-full ">
      <Line data={data} options={options} />
    </div>
  )
}

export default AvgPriceChart
