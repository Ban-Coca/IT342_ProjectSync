import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function ProjectsPage(){
    const { currentUser, getAuthHeader } = useAuth();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);

    return (
        <MainLayout>
            <div className="flex flex-col gap-2 md:mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold">Projects</h1>
                        <p className="text-muted-foreground">Manage your projects here.</p>
                    </div>
                    <div>
                        <Button className="w-full sm:w-auto ml-0 sm:ml-auto  ">Create New Project</Button>
                    </div>
                </div>
                
                <div>
                    {projects.length > 0 ? (
                        <div className="flex flex-col gap-3 md:gap-4">
                        {mockProjects.map((project) => (
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
                            <Button className="w-full sm:w-auto">
                                Create Your First Project
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}