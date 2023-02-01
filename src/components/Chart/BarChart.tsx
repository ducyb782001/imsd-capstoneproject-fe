import React from "react"
import { Bar } from "react-chartjs-2"

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

const options = {
  plugins: {
    title: {
      display: true,
      text: "Largest Cities In Massachusetts",
      padding: {
        top: 30,
        bottom: 10,
      },
    },
    subtitle: {
      display: true,
      text: "Custom Chart Subtitle",
    },
    customCanvasBackgroundColor: {
      color: "#000",
    },
  },
  scales: {
    x: {
      ticks: {
        display: true,
        color: "rgba(255, 159, 64, 0.6)",
      },
      // to remove the x-axis grid
      grid: {
        display: true,
      },
    },
    y: {
      ticks: {
        display: true,
        color: "#FF0000",
      },
      // to remove the x-axis grid
      grid: {
        display: false,
      },
    },
  },

  legend: {
    display: true,
    position: "right",
    labels: {
      fontColor: "#000",
    },
  },
  layout: {
    padding: {
      left: 50,
      right: 0,
      bottom: 0,
      top: 0,
    },
  },
  tooltips: {
    enabled: true,
  },
}

function TestChart(props) {
  return (
    <div className="w-full h-[500px] bg-white">
      <Bar data={data} options={options} />
    </div>
  )
}

export default TestChart
