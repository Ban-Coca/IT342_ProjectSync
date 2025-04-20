import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getPriorityColor, getStatusIcon } from "@/utils/task-utils"
import TaskViewCard from "./task-view-card"

export function CalendarTab({ tasks = [] }) {
  const [date, setDate] = useState(new Date())
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  // Group tasks by date for calendar view
  const tasksByDate = {}
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  tasksArray.forEach((task) => {
    const dateKey = format(task.dueDate, "yyyy-MM-dd")
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = []
    }
    tasksByDate[dateKey].push(task)
  })

  function handleSelectTask(task) {
    setSelectedTask(task)
    setIsSheetOpen(true)
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" initialFocus />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-5">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-lg">Tasks for {date ? format(date, "MMMM d, yyyy") : "Today"}</CardTitle>
          </CardHeader>
          <CardContent>
            {date && tasksByDate[format(date, "yyyy-MM-dd")] ? (
              <div className="space-y-4">
                {tasksByDate[format(date, "yyyy-MM-dd")].map((task) => (
                  <div
                    key={task.taskId}
                    className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSelectTask(task.taskId)}
                  >
                    <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <Badge variant="outline" className={cn("font-normal", getPriorityColor(task.priority))}>
                          {task.priority}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{task.assignedTo.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium text-lg">No tasks for this day</h3>
                <p className="text-muted-foreground">Select another date or add a new task</p>
                <Button className="mt-4">Add Task</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedTask && (
        <TaskViewCard
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          taskId={selectedTask}
          onSelectTask={handleSelectTask}
        />
      )}
    </div>
  )
}