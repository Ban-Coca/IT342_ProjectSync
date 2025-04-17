import { useState } from "react"
import { format } from "date-fns"
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getPriorityColor, getStatusIcon } from "@/utils/task-utils"
import { ClipboardX } from "lucide-react"

// Draggable table row component
function DraggableTableRow({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <TableCell>
        <div className="font-medium">{task.title}</div>
        <div className="text-sm text-muted-foreground hidden sm:block">{task.description}</div>
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
            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
            <AvatarFallback>{task.assignee.initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{task.assignee.name}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}

// Empty state component for when there are no tasks
function EmptyState({ status }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 border rounded-md bg-muted/10">
      <ClipboardX className="h-8 w-8 text-muted-foreground mb-3" />
      <h4 className="text-lg font-medium mb-1">No tasks</h4>
      <p className="text-sm text-muted-foreground text-center">
        There are no tasks in the {status.toLowerCase()} status.
        <br />
        Drag and drop tasks here to change their status.
      </p>
    </div>
  )
}

// Status table component
function StatusTable({ status, tasks }) {
  const isEmpty = tasks.length === 0

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        {getStatusIcon(status)}
        <h3 className="text-lg font-medium">{status}</h3>
        <Badge variant="secondary" className="ml-2">
          {tasks.length}
        </Badge>
      </div>

      {isEmpty ? (
        <EmptyState status={status} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Task</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead className="hidden md:table-cell">Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Assignee</TableHead>
              </TableRow>
            </TableHeader>
            <SortableContext items={tasks.map((task) => task.id)}>
              <TableBody>
                {tasks.map((task) => (
                  <DraggableTableRow key={task.id} task={task} />
                ))}
              </TableBody>
            </SortableContext>
          </Table>
        </div>
      )}
    </div>
  )
}

export function TableTab({ tasks: initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks || [])

  //Sensors for drag and drop
  const pointerSensor = useSensor(PointerSensor)
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })

  const sensors = useSensors(pointerSensor, keyboardSensor)

  // Handle case when initialTasks is empty or undefined
  if (!initialTasks || initialTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ClipboardX className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No tasks available</h3>
        <p className="text-muted-foreground text-center max-w-md">
          There are no tasks to display. Create some tasks to get started with your project management.
        </p>
      </div>
    )
  }

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = []
    }
    acc[task.status].push(task)
    return acc
  }, {})

  // Get unique statuses
  const statuses = Object.keys(tasksByStatus)

  function handleDragEnd(event) {
    const { active, over } = event

    if (!over) return

    // Find the task being dragged
    const activeTask = tasks.find((task) => task.id === active.id)
    if (!activeTask) return

    // Find which table the task was dropped on
    const overTableStatus = statuses.find((status) => {
      return tasksByStatus[status].some((task) => task.id === over.id)
    })

    if (!overTableStatus || activeTask.status === overTableStatus) return

    // Update the task's status
    setTasks((prev) => prev.map((task) => (task.id === active.id ? { ...task, status: overTableStatus } : task)))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div>
        {statuses.map((status) => (
          <StatusTable key={status} status={status} tasks={tasksByStatus[status] || []} />
        ))}
      </div>
    </DndContext>
  )
}