import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/authentication-context";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectById } from "@/service/ProjectService/projectService";
import { toast } from 'sonner';
import { Loading } from "@/components/loading-state";
import { CalendarIcon, LayoutGrid, FolderRoot, ListTodo, Files, EllipsisVertical } from "lucide-react";
import MainLayout from "@/components/main-layout";
import DetailsView from "./DetailsView";
import { TableTab } from "@/components/task-table";
import { BoardTab } from "@/components/board-tab";
import { CalendarTab } from "@/components/calendar-tab";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";
import { Button } from "@/components/ui/button";
import { ProjectDropdown } from "@/components/project-dropdown-fucntions";
import ProjectModal from "@/components/project-modal";
import DeleteModal from "@/components/delete-modal";
import TaskModal from "@/components/task-modal";

export default function ProjectDetailsPage () {
    const { projectId } = useParams();
    const { currentUser, getAuthHeader } = useAuth();
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [currentProject, setCurrentProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [localTasks, setLocalTasks] = useState([]);

    const {
        project,
        isProjectLoading,
        projectError,
        editProjectMutation,
        deleteProjectMutation,
    } = useProject({
        projectId,
        currentUser,
        queryClient,
        getAuthHeader,
        onCreateSuccess: () => {setDialogOpen(false);},
        onUpdateSuccess: () => {setDialogOpen(false);},
        onDeleteSuccess: () => {setDeleteDialogOpen(false); Navigate("/projects");},
    });
    
    const {
        tasks,
        isTasksLoading,
        tasksError,
        createTaskMutation,
        editTaskMutation,
        deleteTaskMutation,
    } = useTask({
        projectId,
        currentUser,
        queryClient,
        getAuthHeader,
        onCreateSuccess: () => {setTaskDialogOpen(false);},
        onUpdateSuccess: () => {setTaskDialogOpen(false);},
        onDeleteSuccess: () => {},
    });

    const handleEditProject = (project) => {
        const projectWithOwner = {
            ...project,
            ownerId:{
                userId: currentUser?.userId
            } 
        }
        editProjectMutation.mutate(projectWithOwner)
    }

    const handleDeleteProject = (projectId) => {
        deleteProjectMutation.mutate(projectId);
    }

    const handleEditButton = (project) => {
        setCurrentProject(project);
        setDialogOpen(true);
    };
    
    const handleDeleteButton = (project) => {
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
    }
    const handleDialogChange = (open) => {
        setDialogOpen(open);
        if (!open) {
            setCurrentProject(null);
        }
    };

    const handleTaskDialogChange = (open) => {
        setTaskDialogOpen(open);
        if (!open) {
            setTaskToEdit(null);
        }
    }
    const handleCreateTask = (task) => {   
        const taskWithProject = {
            ...task,
            project: {
                projectId: project.projectId,
            },
        }
        createTaskMutation.mutate(taskWithProject)
    }
    useEffect(() => {
        if(tasks){
            setLocalTasks(tasks);
        }
    }, [tasks])
    return (
        <MainLayout>
            {isProjectLoading ?  (
                    <div className="flex justify-center items-center h-48 sm:h-64">
                        <Loading variant="dots" size="lg" text="Fetching Project Details..." textPosition="bottom"/>
                    </div> 
                ) : (
                <div className="container mx-auto py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col items-start gap-0.5">
                            <h1 className="text-4xl font-bold">{project.name}</h1>
                            <p className="text-sm text-muted-foreground">Task Id: {project.projectId}</p>
                        </div>
                        <div className="flex items-center self-end sm:self-auto gap-2">
                            <ProjectDropdown 
                                project={project} 
                                onEdit={() => handleEditButton(project)} 
                                onDelete={() => handleDeleteButton(project)}
                            />
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
                            <TabsTrigger value="Files" className="flex items-center gap-2">
                                <Files className="h-4 w-4" />
                                <span className="hidden sm:inline">Files</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <DetailsView project={project}/>
                        </TabsContent>
                        <TabsContent value="task" className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Tasks</h2>
                                <Button onClick={() => setTaskDialogOpen(true)}>
                                    Add Task
                                </Button>
                            </div>
                            {isTasksLoading ? (
                                <div className="flex justify-center items-center h-48 sm:h-64">
                                    <Loading variant="dots" size="lg" text="Fetching Tasks..." textPosition="bottom"/>
                                </div> 
                            ) : (
                                <TableTab 
                                    tasks={tasks}
                                    projectId={projectId}
                                    setTasks={setLocalTasks} />
                            )}
                            
                        </TabsContent>
                        <TabsContent value="board" className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Tasks Board</h2>
                                <Button onClick={() => setTaskDialogOpen(true)}>
                                    Add Task
                                </Button>
                            </div>
                            <BoardTab tasks={tasks} />
                        </TabsContent>
                        <TabsContent value="calendar" className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Calendar</h2>
                                <Button onClick={() => setTaskDialogOpen(true)}>
                                    Add Task
                                </Button>
                            </div>
                            <CalendarTab tasks={tasks} />
                        </TabsContent>
                        <TabsContent value="Files" className="space-y-4">
                            {/* <FilesTab tasks={tasks} /> */}
                        </TabsContent>
                    </Tabs>
                </div>
            )}
            <ProjectModal 
                open={dialogOpen} 
                onOpenChange={handleDialogChange} 
                onSubmit={handleEditProject}
                project={currentProject}
                
            />
            <DeleteModal 
                open={deleteDialogOpen} 
                onOpenChange={setDeleteDialogOpen} 
                onDelete={handleDeleteProject}
                entityType="project"
                project={projectToDelete}
            />

            <TaskModal
                open={taskDialogOpen} 
                onOpenChange={setTaskDialogOpen} 
                onSubmit={handleCreateTask}
                task={null}
                teamMembers={ project.teamMemberIds|| []}
            />
        </MainLayout>
    )
}