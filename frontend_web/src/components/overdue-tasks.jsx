import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function OverdueTasks({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return <div className="flex h-40 items-center justify-center">No overdue tasks</div>
  }

  // Sort tasks by days overdue (descending)
  const sortedTasks = [...tasks].sort((a, b) => b.daysOverdue - a.daysOverdue)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Days Overdue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.projectName}</TableCell>
            <TableCell>{format(new Date(task.dueDate), "MMM dd, yyyy")}</TableCell>
            <TableCell>
              <Badge
                variant={task.daysOverdue > 7 ? "destructive" : "outline"}
                className={task.daysOverdue > 7 ? "" : "text-orange-500 border-orange-500"}
              >
                {task.daysOverdue} {task.daysOverdue === 1 ? "day" : "days"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
