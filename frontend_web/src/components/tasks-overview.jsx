"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function TasksOverview({ data, type = "status" }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || !data || Object.keys(data).length === 0) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const labels = Object.keys(data)
    const values = Object.values(data)

    // Define colors based on type
    let backgroundColor = []
    let borderColor = []

    if (type === "status") {
      backgroundColor = [
        "rgba(34, 197, 94, 0.2)", // Completed - green
        "rgba(59, 130, 246, 0.2)", // In Progress - blue
        "rgba(234, 179, 8, 0.2)", // Pending - yellow
        "rgba(239, 68, 68, 0.2)", // Blocked - red
      ]
      borderColor = ["rgb(34, 197, 94)", "rgb(59, 130, 246)", "rgb(234, 179, 8)", "rgb(239, 68, 68)"]
    } else if (type === "priority") {
      backgroundColor = [
        "rgba(239, 68, 68, 0.2)", // High - red
        "rgba(234, 179, 8, 0.2)", // Medium - yellow
        "rgba(59, 130, 246, 0.2)", // Low - blue
      ]
      borderColor = ["rgb(239, 68, 68)", "rgb(234, 179, 8)", "rgb(59, 130, 246)"]
    } else {
      // Generate colors for projects
      backgroundColor = labels.map((_, i) => `hsla(${(i * 360) / labels.length}, 70%, 60%, 0.2)`)
      borderColor = labels.map((_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`)
    }

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: type === "project" ? "pie" : "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor,
            borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  if (!data || Object.keys(data).length === 0) {
    return <div className="flex h-40 items-center justify-center">No data available</div>
  }

  return (
    <div className="h-60">
      <canvas ref={chartRef} />
    </div>
  )
}
