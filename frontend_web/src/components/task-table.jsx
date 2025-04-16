"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getPriorityColor, getStatusIcon } from "@/utils/task-utils"

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

// Status table component
function StatusTable({ status, tasks }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        {getStatusIcon(status)}
        <h3 className="text-lg font-medium">{status}</h3>
        <Badge variant="secondary" className="ml-2">
          {tasks.length}
        </Badge>
      </div>

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
    </div>
  )
}

export function TableTab({ tasks: initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks)

  // Group tasks by status
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    }, {}
  )

  // Get unique statuses
  const statuses = Object.keys(tasksByStatus)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

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
          <StatusTable key={status} status={status} tasks={tasksByStatus[status]} />
        ))}
      </div>
    </DndContext>
  )
}
