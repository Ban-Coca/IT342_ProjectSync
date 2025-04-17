import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProjectModal from "@/components/project-modal";
import { getProjectsByUserId, createProject } from "@/service/ProjectService/projectService";
import { toast } from "sonner"

const mockUsers = [
    { userId: "user1", name: "John Doe" },
    { userId: "user2", name: "Jane Smith" },
    { userId: "user3", name: "Robert Johnson" },
    { userId: "user4", name: "Emily Davis" },
    { userId: "user5", name: "Michael Wilson" },
  ]

export default function ProjectsPage(){
    const { currentUser, getAuthHeader } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [users, setUsers] = useState(mockUsers)

    const [dialogOpen, setDialogOpen] = useState(false)

    const { data: projects =[], isLoading, error} = useQuery({
        queryKey: ["projects", currentUser?.userId],
        queryFn: () => getProjectsByUserId(currentUser?.userId, getAuthHeader()),
        enabled: !!currentUser?.userId,
    })

    const createProjectMutation = useMutation({
        mutationFn: (newProject) => createProject(newProject, getAuthHeader()),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["projects", currentUser?.userId]);
            setDialogOpen(false);
            toast.success("Project created successfully")
        },
        onError: (error) => {
            toast.error("Failed to create project")
        },
    })

    const handleCreateProject = (project) => {
        const projectWithOwner = {
            ...project,
            owner: {
                userId: currentUser?.userId
            }
        }
        createProjectMutation.mutate(projectWithOwner)
    }
    return (
        <MainLayout>
            <div className="flex flex-col gap-2 md:mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold">Projects</h1>
                        <p className="text-muted-foreground">Manage your projects here.</p>
                    </div>
                    <div>
                    <Button className="w-full sm:w-auto ml-0 sm:ml-auto" onClick={() => setDialogOpen(true)}>
                        Create New Project
                    </Button>
                    </div>
                </div>
                
                <div>
                    {projects.length > 0 ? (
                        <div className="flex flex-col gap-3 md:gap-4">
                        {projects.map((project) => (
                            <div
                            key={project.id}
                            className="flex flex-col sm:flex-row justify-between border rounded-md p-3 sm:p-4 hover:bg-muted/50 transition duration-300 ease-in-out cursor-pointer"
                            >
                                <div className="mb-2 sm:mb-0">
                                    <h2 className="text-base sm:text-lg font-bold">{project.name}</h2>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{project.description}</p>
                                </div>
                                <div className="flex items-center self-end sm:self-auto gap-2">
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:bg-primary hover:text-white"
                                    >
                                    <EllipsisVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 sm:h-64 border rounded-md flex-col gap-3 sm:gap-4 p-4 sm:p-6 text-center">
                        <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                            You don't have any projects yet. Start by creating your first project to organize your work and
                            collaborate with your team.
                        </p>
                        <Button className="w-full sm:w-auto" onClick={() => setDialogOpen(true)}>
                            Create Your First Project
                        </Button>
                        </div>
                    )}
                </div>
            </div>
            <ProjectModal 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                onCreateProject={handleCreateProject} 
                availableUsers={users}/>
        </MainLayout>
    )
}