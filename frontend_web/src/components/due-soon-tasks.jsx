import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function DueSoonTasks({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return <div className="flex h-40 items-center justify-center">No tasks due soon</div>
  }

  // Sort tasks by due date (ascending)
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.projectName}</TableCell>
            <TableCell>{format(new Date(task.dueDate), "MMM dd, yyyy")}</TableCell>
            <TableCell>
              <PriorityBadge priority={task.priority} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function PriorityBadge({ priority }) {
  const lowerPriority = priority?.toLowerCase()

  if (lowerPriority === "high") {
    return <Badge variant="destructive">High</Badge>
  } else if (lowerPriority === "medium") {
    return <Badge variant="default">Medium</Badge>
  } else if (lowerPriority === "low") {
    return <Badge variant="outline">Low</Badge>
  }

  return <Badge variant="secondary">{priority}</Badge>
}
