import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function TaskTrends({ tasksByMonth, statusDistribution }) {
  const lineChartRef = useRef(null)
  const stackedChartRef = useRef(null)
  const lineChartInstance = useRef(null)
  const stackedChartInstance = useRef(null)

  useEffect(() => {
    if (!lineChartRef.current || !tasksByMonth || Object.keys(tasksByMonth).length === 0) return

    // Destroy previous chart if it exists
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy()
    }

    const ctx = lineChartRef.current.getContext("2d")
    if (!ctx) return

    // Sort months chronologically
    const sortedMonths = Object.keys(tasksByMonth).sort()
    const values = sortedMonths.map((month) => tasksByMonth[month])

    // Create chart
    lineChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedMonths,
        datasets: [
          {
            label: "Tasks by Month",
            data: values,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Tasks",
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
      },
    })

    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy()
      }
    }
  }, [tasksByMonth])

  useEffect(() => {
    if (!stackedChartRef.current || !statusDistribution || Object.keys(statusDistribution).length === 0) return

    // Destroy previous chart if it exists
    if (stackedChartInstance.current) {
      stackedChartInstance.current.destroy()
    }

    const ctx = stackedChartRef.current.getContext("2d")
    if (!ctx) return

    // Sort months chronologically
    const sortedMonths = Object.keys(statusDistribution).sort()

    // Get all unique statuses
    const allStatuses = new Set()
    sortedMonths.forEach((month) => {
      Object.keys(statusDistribution[month]).forEach((status) => {
        allStatuses.add(status)
      })
    })

    const statusList = Array.from(allStatuses)

    // Create datasets for each status
    const datasets = statusList.map((status) => {
      // Generate a consistent color based on status
      let color
      switch (status.toLowerCase()) {
        case "completed":
          color = "rgb(34, 197, 94)"
          break
        case "in progress":
          color = "rgb(59, 130, 246)"
          break
        case "pending":
          color = "rgb(234, 179, 8)"
          break
        case "blocked":
          color = "rgb(239, 68, 68)"
          break
        default:
          // Generate a random color for other statuses
          const hue = Math.floor(Math.random() * 360)
          color = `hsl(${hue}, 70%, 60%)`
      }

      return {
        label: status,
        data: sortedMonths.map((month) => statusDistribution[month][status] || 0),
        backgroundColor: color,
      }
    })

    // Create chart
    stackedChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedMonths,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: "Month",
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Tasks",
            },
          },
        },
      },
    })

    return () => {
      if (stackedChartInstance.current) {
        stackedChartInstance.current.destroy()
      }
    }
  }, [statusDistribution])

  if (
    (!tasksByMonth || Object.keys(tasksByMonth).length === 0) &&
    (!statusDistribution || Object.keys(statusDistribution).length === 0)
  ) {
    return <div className="flex h-40 items-center justify-center">No trend data available</div>
  }

  return (
    <div className="space-y-8">
      <div className="h-60">
        <h3 className="mb-2 text-sm font-medium">Tasks Over Time</h3>
        <canvas ref={lineChartRef} />
      </div>

      <div className="h-60">
        <h3 className="mb-2 text-sm font-medium">Task Status Distribution</h3>
        <canvas ref={stackedChartRef} />
      </div>
    </div>
  )
}
