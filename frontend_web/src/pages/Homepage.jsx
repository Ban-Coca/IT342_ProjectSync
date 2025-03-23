import { useState } from "react";
import AppSidebar from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
const mockProjects = [
    { id: 1, name: "Project Alpha", description: "Description for Project Alpha" },
    { id: 2, name: "Project Beta", description: "Description for Project Beta" },
    { id: 3, name: "Project Gamma", description: "Description for Project Gamma" },
    { id: 4, name: "Project Delta", description: "Description for Project Delta" },
    { id: 5, name: "Project Epsilon", description: "Description for Project Epsilon" },
    { id: 6, name: "Project Zeta", description: "Description for Project Zeta" },
];

function Homepage({children}) {
    const isMobile = useIsMobile();
    return (
        <div class="flex h-full">
            <div id="sidebar">
                <SidebarProvider>
                    <AppSidebar className="bg-sidebar" />
                    <main>
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
            </div>
            <div id="content" className="flex-1 flex flex-col ">
                <div id="header" className="text-black p-4 mt-12">
                    <h1 className="text-4xl md:text-3xl sm:text-2xl font-bold ">Welcome back "Insert Name here"</h1>
                </div>
                <div id="project-cards" className="text-black p-4">
                    <div id="content-header">
                        <h2 className="text-2xl font-bold">Your Current Projects</h2>
                        <div className="w-full h-0.5 bg-gray-300 my-4"/>
                    </div>
                    <div id="cards" className={`scroll flex flex-wrap gap-4 ${isMobile ? 'flex-col' : 'h-60 w-auto '}`}>
                        {mockProjects.map((project) => (
                            <Card key={project.id} className={`${isMobile ? 'w-full' : 'w-auto'} h-52`}>
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {project.description}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage;