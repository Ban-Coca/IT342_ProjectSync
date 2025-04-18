import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/service/ProjectService/projectService";
import { toast } from "sonner";
import { Loading } from "@/components/loading-state";
import { CalendarIcon, LayoutGrid, FolderRoot, ListTodo, Files, EllipsisVertical } from "lucide-react";
import MainLayout from "@/components/main-layout";
import DetailsView from "./DetailsView";
import { TableTab } from "@/components/task-table";
import { BoardTab } from "@/components/board-tab";
import { CalendarTab } from "@/components/calendar-tab";
import { Button } from "@/components/ui/button";
import { ProjectDropdown } from "@/components/project-dropdown-fucntions";
export default function ProjectDetailsPage () {
    const { projectId } = useParams();
    const { currentUser, getAuthHeader } = useAuth();

    const { data, isPending, error } = useQuery({
        queryKey: ["project", currentUser?.userId],
        queryFn: () => getProjectById(projectId, getAuthHeader()),
        enabled: !!currentUser?.userId,
        onError: (error) => {
            toast.error("Failed to fetch project details. Please try again.")
        },
    })

    const updateProject = useMutation({
        mutationFn: (updatedProject) => updateProject(data.projectId, updatedProject, getAuthHeader()),
        onSuccess: (data) => {
            toast.success("Project updated successfully")
        },
        onError: (error) => {
            toast.error("Failed to update project. Please try again.")
        },
    })
    return (
        <MainLayout>
            {isPending ?  (
                    <div className="flex justify-center items-center h-48 sm:h-64">
                        <Loading variant="dots" size="lg" text="Fetching Project Details..." textPosition="bottom"/>
                    </div> 
                ) : (
                <div className="container mx-auto py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col items-start gap-0.5">
                            <h1 className="text-4xl font-bold">{data.name}</h1>
                            <p className="text-sm text-muted-foreground">{data.projectId}</p>
                        </div>
                        <div className="flex items-center self-end sm:self-auto gap-2">
                            <ProjectDropdown project={data} onProjectUpdate={updateProject} />
                        </div>
                    </div>
                    <Tabs defaultValue="overview" className="mt-4 w-full">
                        <TabsList className="bg-primary text-white grid w-full grid-cols-5 mb-6">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <FolderRoot className="h-4 w-4" />
                                <span className="hidden sm:inline">Overview</span>
                            </TabsTrigger>
                            <TabsTrigger value="task" className="flex items-center gap-2">
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

                        <TabsContent value="overview" className="space-y-4">
                            <DetailsView project={data} onProjectUpdate={updateProject}/>
                        </TabsContent>
                        <TabsContent value="task" className="space-y-4">
                            <TableTab tasks={data.tasks} />
                        </TabsContent>
                        <TabsContent value="board" className="space-y-4">
                            <BoardTab tasks={data.tasks} />
                        </TabsContent>
                        <TabsContent value="calendar" className="space-y-4">
                            <CalendarTab tasks={data.tasks} />
                        </TabsContent>
                        <TabsContent value="Files" className="space-y-4">
                            {/* <FilesTab tasks={tasks} /> */}
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </MainLayout>
    )
}