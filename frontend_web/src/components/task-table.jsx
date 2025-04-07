import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getPriorityColor, getStatusIcon } from "@/utils/task-utils"

export function TableTab({ tasks }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Task</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Assignee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-muted-foreground hidden sm:block">{task.description}</div>
                <div className="flex items-center gap-2 mt-1 sm:hidden">
                  {getStatusIcon(task.status)}
                  <span className="text-xs">{task.status}</span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span>{task.status}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{format(task.dueDate, "MMM d, yyyy")}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline" className={cn("font-normal", getPriorityColor(task.priority))}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

