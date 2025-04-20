import { useState } from "react";
import MainLayout from "@/components/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authentication-context";
import { ChevronLeft, ChevronRight, Briefcase, Plus, FileText } from "lucide-react";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/components/loading-state";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const isMobile = useIsMobile();
    const { currentUser, getAuthHeader } = useAuth();
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const {
        projects,
        isLoading,
        error,
    } = useProject({
        currentUser,
        queryClient,
        getAuthHeader,
    })
    
    const { assignedToMe, isAssignTaskLoading } = useTask({
        currentUser,
        queryClient,
        getAuthHeader,
    })
    
    const [projectPage, setProjectPage] = useState(1)
    const projectsPerPage = isMobile ? 2 : 3
    const totalProjectPages = Math.max(1, Math.ceil(projects.length / projectsPerPage))

    
    const [taskPage, setTaskPage] = useState(1)
    const tasksPerPage = 3
    const totalTaskPages = Math.max(1, Math.ceil(assignedToMe?.length / tasksPerPage))

    
    const indexOfLastProject = projectPage * projectsPerPage
    const indexOfFirstProject = indexOfLastProject - projectsPerPage
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject)

    const indexOfLastTask = taskPage * tasksPerPage
    const indexOfFirstTask = indexOfLastTask - tasksPerPage
    const currentTasks = assignedToMe?.slice(indexOfFirstTask, indexOfLastTask)

    
    const projectsEmpty = projects.length === 0
    const tasksEmpty = assignedToMe?.length === 0

    
    const nextProjectPage = () => {
        if (projectPage < totalProjectPages) {
        setProjectPage(projectPage + 1)
        }
    }

    const prevProjectPage = () => {
        if (projectPage > 1) {
        setProjectPage(projectPage - 1)
        }
    }

    const nextTaskPage = () => {
        if (taskPage < totalTaskPages) {
        setTaskPage(taskPage + 1)
        }
    }

    const prevTaskPage = () => {
        if (taskPage > 1) {
        setTaskPage(taskPage - 1)
        }
    }

    return (
        <MainLayout>
            <div className="mt-4 mb-8">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold">Welcome back, {currentUser?.firstName}</h1>
                </div>
                
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Your Current Projects</h2>
                    <div className="w-full h-0.5 bg-gray-300 my-2" />
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <Loading variant="spinner" size="xl" text="Loading projects..." />
                    </div>
                ) : projectsEmpty ? (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
                        <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                        <p className="text-muted-foreground mb-4 text-center">
                            You don't have any projects yet. Create your first project to get started.
                        </p>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create New Project
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className={`flex gap-4 ${isMobile ? "flex-col" : "overflow-x-auto"} pb-4`}>
                            {currentProjects.map((project) => (
                                <Card
                                key={project.id}
                                className={`${
                                    isMobile ? "w-full" : "w-[calc(33.33%-1rem)]"
                                } h-52 transition-transform duration-200 hover:shadow-lg hover:bg-muted/50 hover:border-primary/50 cursor-pointer`}
                                onClick={() => navigate(`/projects/${project.projectId}`)}
                                >
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                </CardHeader>
                                    <CardContent>{project.description}</CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Projects Pagination */}
                        <div className="flex items-center justify-center mt-4 space-x-2">
                            <Button variant="outline" size="icon" onClick={prevProjectPage} disabled={projectPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous page</span>
                            </Button>
                            <div className="text-sm">
                                Page {projectPage} of {totalProjectPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={nextProjectPage}
                                disabled={projectPage === totalProjectPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next page</span>
                            </Button>
                        </div>
                    </>
                )}
            </div>

          
            <div className="mt-8 mb-8">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Your Current Tasks</h2>
                    <div className="w-full h-0.5 bg-gray-300 my-2" />
                </div>
                {tasksEmpty ? (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No tasks available</h3>
                        <p className="text-muted-foreground mb-4 text-center">
                        You don't have any tasks assigned to you. Create a new task to get started.
                        </p>
                        <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Task
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <ul className="divide-y">
                                {currentTasks?.map((task) => (
                                    <li key={task.taskId} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                        <div>
                                            <h3 className="font-medium">{task.title}</h3>
                                            <p className="text-sm text-muted-foreground">{task.description}</p>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                                    ${
                                                                    task.status === "Completed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : task.status === "In Progress"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tasks Pagination */}
                        <div className="flex items-center justify-center mt-4 space-x-2">
                            <Button variant="outline" size="icon" onClick={prevTaskPage} disabled={taskPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous page</span>
                            </Button>
                            <div className="text-sm">
                                Page {taskPage} of {totalTaskPages}
                            </div>
                            <Button variant="outline" size="icon" onClick={nextTaskPage} disabled={taskPage === totalTaskPages}>
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next page</span>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}

export default Homepage;