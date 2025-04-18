import { useState } from "react";
import MainLayout from "@/components/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authentication-context";
import { ChevronLeft, ChevronRight, Briefcase, Plus, FileText } from "lucide-react";
const mockProjects = [
    // { id: 1, name: "Project Alpha", description: "Description for Project Alpha" },
    // { id: 2, name: "Project Beta", description: "Description for Project Beta" },
    // { id: 3, name: "Project Gamma", description: "Description for Project Gamma" },
    // { id: 4, name: "Project Delta", description: "Description for Project Delta" },
    // { id: 5, name: "Project Epsilon", description: "Description for Project Epsilon" },
    // { id: 6, name: "Project Zeta", description: "Description for Project Zeta" },
  ]
  
  const mockTasks = [
    // { id: 1, title: "Task One", description: "Description for Task One", status: "In Progress" },
    // { id: 2, title: "Task Two", description: "Description for Task Two", status: "Completed" },
    // { id: 3, title: "Task Three", description: "Description for Task Three", status: "Pending" },
    // { id: 4, title: "Task Four", description: "Description for Task Four", status: "In Progress" },
    // { id: 5, title: "Task Five", description: "Description for Task Five", status: "Completed" },
    // { id: 6, title: "Task Six", description: "Description for Task Six", status: "Pending" },
  ]

function Homepage() {
    const isMobile = useIsMobile();
    const { currentUser } = useAuth();

    // Pagination state for projects
    const [projectPage, setProjectPage] = useState(1)
    const projectsPerPage = isMobile ? 2 : 3
    const totalProjectPages = Math.max(1, Math.ceil(mockProjects.length / projectsPerPage))

    // Pagination state for tasks
    const [taskPage, setTaskPage] = useState(1)
    const tasksPerPage = 3
    const totalTaskPages = Math.max(1, Math.ceil(mockTasks.length / tasksPerPage))

    // Get current projects and tasks based on pagination
    const indexOfLastProject = projectPage * projectsPerPage
    const indexOfFirstProject = indexOfLastProject - projectsPerPage
    const currentProjects = mockProjects.slice(indexOfFirstProject, indexOfLastProject)

    const indexOfLastTask = taskPage * tasksPerPage
    const indexOfFirstTask = indexOfLastTask - tasksPerPage
    const currentTasks = mockTasks.slice(indexOfFirstTask, indexOfLastTask)

    // Check if lists are empty
    const projectsEmpty = mockProjects.length === 0
    const tasksEmpty = mockTasks.length === 0

    // Pagination controls
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
                {projectsEmpty ? (
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
                                {currentTasks.map((task) => (
                                    <li key={task.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
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