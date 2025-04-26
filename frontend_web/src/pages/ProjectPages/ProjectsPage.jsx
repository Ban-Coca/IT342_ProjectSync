import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ProjectModal from "@/components/project-modal";
import { ProjectDropdown } from "@/components/project-dropdown-fucntions";
import DeleteModal from "@/components/delete-modal";
import { useProject } from "@/hooks/use-project";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function ProjectsPage(){
    const { currentUser, getAuthHeader } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [users, setUsers] = useState()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [currentProject, setCurrentProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;

    const {
        projects,
        isLoading,
        error,
        createProjectMutation,
        editProjectMutation,
        deleteProjectMutation,
    } = useProject({
        currentUser,
        queryClient,
        getAuthHeader,
        onCreateSuccess: () => {setDialogOpen(false);},
        onUpdateSuccess: () => {setDialogOpen(false);},
        onDeleteSuccess: () => {setDeleteDialogOpen(false);},
    });

    const totalPages = projects ? Math.ceil(projects.length / projectsPerPage) : 0;
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects ? projects.slice(indexOfFirstProject, indexOfLastProject) : [];
    
    // Pagination handlers
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleCreateProject = (project) => {
        const projectWithOwner = {
            ...project,
            ownerId:{
                userId: currentUser?.userId
            } 
        }
        createProjectMutation.mutate(projectWithOwner)
    }

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
                
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-92 sm:h-64 gap-4">
                        <Skeleton className="h-full w-full" />
                        <Skeleton className="h-full w-full" />
                        <Skeleton className="h-full w-full" />
                        <Skeleton className="h-full w-full" />
                    </div>
                ) : (
                    <div>
                        {projects && projects.length > 0 ? (
                            <>
                                <div className="flex flex-col gap-3 md:gap-4">
                                    {currentProjects.map((project) => (
                                        <div
                                        key={project.projectId}
                                        className="flex flex-col sm:flex-row justify-between border rounded-md p-3 sm:p-4 hover:bg-muted/50 transition duration-300 ease-in-out cursor-pointer"
                                        >
                                            <div 
                                                className="mb-2 sm:mb-0 flex-grow cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/projects/${project.projectId}`);
                                                }}                                        
                                            >
                                                <h2 className="text-base sm:text-lg font-bold">{project.name}</h2>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{project.description}</p>
                                            </div>
                                            <div className="flex items-center self-end sm:self-auto gap-2">
                                                <ProjectDropdown 
                                                    project={project} 
                                                    onEdit={() => handleEditButton(project)} 
                                                    onDelete={() => handleDeleteButton(project)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-between items-center mt-6 p-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Previous
                                        </Button>
                                        
                                        <span className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-1"
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
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
                )}
            </div>
            <ProjectModal 
                open={dialogOpen} 
                onOpenChange={handleDialogChange} 
                onSubmit={currentProject ? handleEditProject : handleCreateProject}
                project={currentProject}
                availableUsers={users}
            />
            <DeleteModal 
                open={deleteDialogOpen} 
                onOpenChange={setDeleteDialogOpen} 
                onDelete={handleDeleteProject}
                entityType="project"
                project={projectToDelete}
            />
        </MainLayout>
    )
}