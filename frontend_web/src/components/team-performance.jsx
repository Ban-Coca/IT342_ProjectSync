import { useEffect, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)


export function TeamPerformance({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const labels = data.map((member) => member.name)
    const completionRates = data.map((member) => member.completionRate)
    const totalTasks = data.map((member) => member.totalTasks)

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Completion Rate (%)",
            data: completionRates,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Total Tasks",
            data: totalTasks,
            backgroundColor: "rgba(99, 102, 241, 0.5)",
            borderColor: "rgb(99, 102, 241)",
            borderWidth: 1,
            type: "line",
            yAxisID: "y1",
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
              text: "Completion Rate (%)",
            },
            max: 100,
          },
          y1: {
            beginAtZero: true,
            position: "right",
            title: {
              display: true,
              text: "Total Tasks",
            },
            grid: {
              drawOnChartArea: false,
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
  }, [data])

  if (!data || data.length === 0) {
    return <div className="flex h-40 items-center justify-center">No team performance data available</div>
  }

  // Sort team members by completion rate (descending)
  const sortedMembers = [...data].sort((a, b) => b.completionRate - a.completionRate)

  return (
    <div className="space-y-6">
      <div className="h-80">
        <canvas ref={chartRef} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Member</TableHead>
            <TableHead>Completion Rate</TableHead>
            <TableHead>Tasks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.map((member) => (
            <TableRow key={member.userId}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>
                <div className="flex w-40 flex-col gap-1">
                  <Progress value={member.completionRate} className="h-2" />
                  <span className="text-xs text-muted-foreground">{Math.round(member.completionRate)}%</span>
                </div>
              </TableCell>
              <TableCell>
                {member.completedTasks} / {member.totalTasks}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
