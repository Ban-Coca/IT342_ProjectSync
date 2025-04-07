import MainLayout from "@/components/main-layout";
import { useState } from "react"
import { CalendarIcon, LayoutGrid, ListTodo, Files  } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TableTab } from "@/components/task-table"
import { BoardTab } from "@/components/board-tab"
import { CalendarTab } from "@/components/calendar-tab"

const initialTasks = [
    {
      id: 1,
      title: "Design new landing page",
      description: "Create wireframes and mockups for the new landing page",
      status: "To Do",
      dueDate: new Date(2025, 3, 10),
      priority: "High",
      assignee: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
    },
    {
      id: 2,
      title: "Implement authentication",
      description: "Add login and registration functionality",
      status: "In Progress",
      dueDate: new Date(2025, 3, 8),
      priority: "High",
      assignee: {
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "ST",
      },
    },
    {
      id: 3,
      title: "Fix navigation bug",
      description: "Address the issue with dropdown menu not working on mobile",
      status: "In Progress",
      dueDate: new Date(2025, 3, 7),
      priority: "Medium",
      assignee: {
        name: "Jamie Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JL",
      },
    },
    {
      id: 4,
      title: "Write documentation",
      description: "Create user guide for the new features",
      status: "To Do",
      dueDate: new Date(2025, 3, 15),
      priority: "Low",
      assignee: {
        name: "Morgan Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MC",
      },
    },
    {
      id: 5,
      title: "QA testing",
      description: "Test all features in the latest release",
      status: "Done",
      dueDate: new Date(2025, 3, 5),
      priority: "Medium",
      assignee: {
        name: "Riley Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "RS",
      },
    },
    {
      id: 6,
      title: "Deploy to production",
      description: "Release the new version to production servers",
      status: "To Do",
      dueDate: new Date(2025, 3, 20),
      priority: "High",
      assignee: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
    },
]

export default function TaskPage(){
    const [tasks, setTasks] = useState(initialTasks)
    const handleTaskUpdate = (updatedTasks) => {
      setTasks(updatedTasks)
    }
    return (
        <MainLayout>
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>
                <p className="text-muted-foreground">Manage and organize your tasks</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="my">My Tasks</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="whitespace-nowrap">Add Task</Button>
              </div>
            </div>

            <Tabs defaultValue="table" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </TabsTrigger>
                <TabsTrigger value="board" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Board</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="Files" className="hidden sm:flex items-center gap-2">
                  <Files className="h-4 w-4" />
                  <span>Files</span>
                </TabsTrigger>
              </TabsList>

              {/* Table View */}
              <TabsContent value="table" className="space-y-4">
                <TableTab tasks={tasks} />
              </TabsContent>

              {/* Board View */}
              <TabsContent value="board">
                <BoardTab tasks={tasks} onTaskUpdate={handleTaskUpdate} />
              </TabsContent>

              {/* Calendar View */}
              <TabsContent value="calendar">
                <CalendarTab tasks={tasks} />
              </TabsContent>
            </Tabs>
          </div>
        </MainLayout>
    )
}