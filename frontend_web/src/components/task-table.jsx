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
import { useAuth } from "@/contexts/authentication-context"
import { useQueryClient } from "@tanstack/react-query"
import { useTask } from "@/hooks/use-task"
import TaskViewCard from "@/components/task-view-card"
import { toast } from 'sonner'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { EyeOffIcon, EyeIcon } from "lucide-react"
// Draggable table row component
function DraggableTableRow({ task, onSelectTask }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.taskId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const assignee = task.assignedTo && task.assignedTo.length > 0 
    ? task.assignedTo[0] : { firstName: "Unassigned", avatar: null, initials: "UN" };
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <TableCell>
        <div 
          className="font-medium cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            onSelectTask(task.taskId);
          }}
        >
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-muted-foreground hidden sm:block">{task.description}</div>
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
            <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
            <AvatarFallback>{assignee.initials || assignee.firstName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{assignee.name}</span>
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
function StatusTable({ status, tasks, onSelectTask }) {
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
            <SortableContext items={tasks.map((task) => task.taskId)}>
              <TableBody>
                {tasks.map((task) => (
                  <DraggableTableRow key={task.taskId} task={task} onSelectTask={onSelectTask} />
                ))}
              </TableBody>
            </SortableContext>
          </Table>
        </div>
      )}
    </div>
  )
}

export function TableTab({ tasks, projectId, setTasks }) {
  // const [tasks, setTasks] = useState(initialTasks || [])
  const { currentUser, getAuthHeader } = useAuth();
  const queryClient = useQueryClient()
  const [selectedTask, setSelectedTask] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showDoneTasks, setShowDoneTasks] = useState(false);

  const { editTaskMutation } = useTask({
    projectId,
    currentUser,
    queryClient,
    getAuthHeader,
    onUpdateSuccess: () => {}
  })

  //Sensors for drag and drop
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
      delay: 100,  
    },
  });
  
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })

  const sensors = useSensors(pointerSensor, keyboardSensor)

  const filteredTasks = tasks ? (showDoneTasks ? tasks : tasks.filter(task => task.status !== "Done")) : [];
  
  if (!filteredTasks || filteredTasks.length === 0) {
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
  const tasksByStatus = filteredTasks.reduce((acc, task) => {
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
    const activeTask = tasks.find((task) => task.taskId === active.id)
    if (!activeTask) return

    // Find which table the task was dropped on
    const overTableStatus = statuses.find((status) => {
      return tasksByStatus[status].some((task) => task.taskId === over.id)
    })

    if (!overTableStatus || activeTask.status === overTableStatus) return

    // Update the task's status
    if (setTasks) {
      setTasks((prev) => 
        prev.map((task) => 
          task.taskId === active.id ? { ...task, status: overTableStatus } : task
        )
      )
    }
    const updatedTask = {
      ...activeTask,
      status: overTableStatus
    };

    editTaskMutation.mutate(updatedTask, {
      onError: () => {
        
        if (setTasks) {
          toast.error("Failed to update task status. Reverting changes.");
          setTasks((prev) => 
            prev.map((task) => 
              task.taskId === active.id ? { ...task, status: activeTask.status } : task
            )
          );
        }
      }
    });
  }

  function handleSelectTask(task) {
    setSelectedTask(task)
    setIsSheetOpen(true)
  }
  //TODO PASS THE SELECTED TASK ID INSTEAD OF THE TASK OBJECT
  return (
    <>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <div className="flex items-center space-x-2">
          {showDoneTasks ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
          <Label htmlFor="show-done-tasks" className="text-sm">
            {showDoneTasks ? "Showing completed tasks" : "Hiding completed tasks"}
          </Label>
        </div>
        <Switch
          id="show-done-tasks"
          checked={showDoneTasks}
          onCheckedChange={setShowDoneTasks}
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div>
          {statuses.map((status) => (
            <StatusTable key={status} status={status} tasks={tasksByStatus[status] || []} onSelectTask={handleSelectTask}/>
          ))}
        </div>
      </DndContext>  
      {selectedTask && (
        <TaskViewCard
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          taskId={selectedTask}
          onSelectTask={handleSelectTask}
        />
      )}
    </>
  )
}