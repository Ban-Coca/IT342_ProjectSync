import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock } from "lucide-react"

export function ProjectProgress({ data, detailed = false }) {
  if (!data || data.length === 0) {
    return <div className="flex h-40 items-center justify-center">No project data available</div>
  }

  // Sort projects by progress percentage (ascending)
  const sortedProjects = [...data].sort((a, b) => a.progressPercentage - b.progressPercentage)

  if (!detailed) {
    // Show only top 5 projects for overview
    const topProjects = sortedProjects.slice(0, 5)

    return (
      <div className="space-y-4">
        {topProjects.map((project) => (
          <div key={project.projectId} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{project.projectName}</span>
                {project.atRisk && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    At Risk
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{Math.round(project.progressPercentage)}%</span>
            </div>
            <Progress value={project.progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {project.completedTasks} / {project.totalTasks} tasks
              </span>
              {project.daysUntilDeadline !== undefined && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {project.daysUntilDeadline > 0
                    ? `${project.daysUntilDeadline} days left`
                    : `Overdue by ${Math.abs(project.daysUntilDeadline)} days`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Detailed view with table
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Tasks</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedProjects.map((project) => (
          <TableRow key={project.projectId}>
            <TableCell className="font-medium">{project.projectName}</TableCell>
            <TableCell>
              <div className="flex w-40 flex-col gap-1">
                <Progress value={project.progressPercentage} className="h-2" />
                <span className="text-xs text-muted-foreground">
                  {Math.round(project.progressPercentage)}% complete
                </span>
              </div>
            </TableCell>
            <TableCell>
              {project.completedTasks} / {project.totalTasks}
            </TableCell>
            <TableCell>
              {project.timeElapsedPercentage !== undefined && (
                <div className="flex flex-col gap-1">
                  <Progress value={project.timeElapsedPercentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {Math.round(project.timeElapsedPercentage)}% time elapsed
                  </span>
                </div>
              )}
            </TableCell>
            <TableCell>
              {project.atRisk ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  At Risk
                </Badge>
              ) : project.progressPercentage >= 90 ? (
                <Badge variant="success">Almost Complete</Badge>
              ) : project.progressPercentage >= 50 ? (
                <Badge variant="default">On Track</Badge>
              ) : (
                <Badge variant="outline">Early Stages</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
