import React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getPriorityColor, getStatusIcon } from "@/utils/task-utils"

// Draggable Task Card Component
function DraggableTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id.toString(),
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-colors",
        isDragging && "shadow-lg",
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn("text-xs font-normal", getPriorityColor(task.priority))}>
            {task.priority}
          </Badge>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{format(task.dueDate, "MMM d")}</span>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback className="text-[10px]">{task.assignee.initials}</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  )
}

// Task Card for Overlay during dragging
function TaskCardOverlay({ task }) {
  return (
    <Card className="shadow-lg w-[250px] opacity-80">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn("text-xs font-normal", getPriorityColor(task.priority))}>
            {task.priority}
          </Badge>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{format(task.dueDate, "MMM d")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Droppable Column Component
function DroppableColumn({
  status,
  tasks,
  children,
}) {
  // Ensure tasks is an array
  tasks = tasks || [];
  
  // Make the column a drop target using the status as the ID
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  });

  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        "rounded-lg border bg-card",
        isOver && "ring-2 ring-primary ring-opacity-50"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <h3 className="font-semibold">{status}</h3>
          <Badge variant="outline" className="ml-auto">
            {tasks.length}
          </Badge>
        </div>
      </div>
      <div className="p-2 space-y-2 max-h-[calc(100vh-250px)] overflow-auto">
        <SortableContext items={tasks.map((task) => task.id.toString())} strategy={verticalListSortingStrategy}>
          {children}
          {tasks.length === 0 && (
            <div className="h-20 flex items-center justify-center border rounded-lg bg-muted/10">
              <span className="text-sm text-muted-foreground">Drop tasks here</span>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}


export function BoardTab({ tasks, onTaskUpdate }) {
  const [activeTask, setActiveTask] = useState(null)

  // Group tasks by status for board view
  const tasksByStatus = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Done: tasks.filter((task) => task.status === "Done"),
  }

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event
    const activeData = active.data.current
    if (activeData?.type === "task") {
      setActiveTask(activeData.task)
    }
  }

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the active container
    const activeContainer = findContainer(activeId.toString())
    
    // Check if we're dropping directly on a column
    const isColumnDrop = ["To Do", "In Progress", "Done"].includes(over.id)
    
    // Determine the destination container
    const overContainer = isColumnDrop 
      ? over.id.toString() 
      : findContainer(overId.toString())
    
    if (activeContainer !== overContainer && ["To Do", "In Progress", "Done"].includes(overContainer)) {
      // Update the task status
      const updatedTasks = tasks.map((task) =>
        task.id.toString() === activeId.toString()
          ? { ...task, status: overContainer }
          : task,
      )
      onTaskUpdate(updatedTasks)
    }

    setActiveTask(null)
  }

  // Helper to find which container a task belongs to
  const findContainer = (id) => {
    if (tasksByStatus["To Do"].some((task) => task.id.toString() === id)) return "To Do"
    if (tasksByStatus["In Progress"].some((task) => task.id.toString() === id)) return "In Progress"
    if (tasksByStatus["Done"].some((task) => task.id.toString() === id)) return "Done"
    return null
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <DroppableColumn key={status} status={status} tasks={statusTasks}>
            {statusTasks.map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
          </DroppableColumn>
        ))}
      </div>
      <DragOverlay>{activeTask ? <TaskCardOverlay task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  )
}

