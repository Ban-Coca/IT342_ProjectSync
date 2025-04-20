import MainLayout from "@/components/main-layout";
import { useEffect, useState } from "react"
import { CalendarIcon, LayoutGrid, ListTodo, Files  } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TableTab } from "@/components/task-table"
import { BoardTab } from "@/components/board-tab"
import { CalendarTab } from "@/components/calendar-tab"
import { useQueryClient } from "@tanstack/react-query"
import { useTask } from "@/hooks/use-task";
import { useProject } from "@/hooks/use-project";
import { useAuth } from "@/contexts/authentication-context"
export default function TaskPage(){
    const [projectId, setProjectId] = useState(null)
    const [localTasks, setLocalTasks] = useState([])
    const { currentUser, getAuthHeader } = useAuth()
    const queryClient = useQueryClient()

    const { project } = useProject({
      currentUser,
      queryClient,
      getAuthHeader,
    })

    const {
      assignedToMe,
      isAssignTaskLoading,
      isAssignTaskError,
    } = useTask({
      currentUser,
      queryClient,
      getAuthHeader,
    })
    
    useEffect(() => {
      if (project && project.projectId) {
        setProjectId(project.projectId)
      }
      if(assignedToMe){
        setLocalTasks(assignedToMe);
      }
    }, [project, assignedToMe])

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Manage and organize your tasks</p>
            </div>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="bg-primary text-white grid w-full grid-cols-3 mb-6">
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
            </TabsList>

              {/* Table View */}
            <TabsContent value="table" className="space-y-4">
              <TableTab 
                tasks={assignedToMe}
                projectId={projectId} />
            </TabsContent>

              {/* Board View */}
            <TabsContent value="board">
              <BoardTab tasks={assignedToMe} />
            </TabsContent>

              {/* Calendar View */}
            <TabsContent value="calendar">
              <CalendarTab tasks={assignedToMe} />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    )
}