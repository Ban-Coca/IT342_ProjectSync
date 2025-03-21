import { useState } from "react";
import AppSidebar from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const mockProjects = [
    { id: 1, name: "Project Alpha", description: "Description for Project Alpha" },
    { id: 2, name: "Project Beta", description: "Description for Project Beta" },
    { id: 3, name: "Project Gamma", description: "Description for Project Gamma" }
];

function Homepage({children}) {
    return (
        <div class="flex h-screen">
            <div id="sidebar">
                <SidebarProvider>
                    <AppSidebar />
                    <main>
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
            </div>
            <div id="content" class="flex-1 flex flex-col ">
                <div id="header" class="text-black p-4 mt-12">
                    <h1 class="text-4xl font-bold">Welcome back "Insert Name here"</h1>
                </div>
                <div id="project-cards" class="text-black p-4">
                    <div id="content-header">
                        <h2 class="text-2xl font-bold">Your Current Projects</h2>
                        <div 
                            style={{
                                width: '100%',
                                height: '1px',
                                backgroundColor: '#e0e0e0',
                                margin: '10px 0'
                            }}/>
                    </div>
                    <div id="cards" class="flex flex-wrap gap-4 h-60">
                        {mockProjects.map((project) => (
                            <Card  key={project.id}>
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