import { useState } from "react";
import AppSidebar from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const mockProjects = [
    { id: 1, name: "Project Alpha", description: "Description for Project Alpha" },
    { id: 2, name: "Project Beta", description: "Description for Project Beta" },
    { id: 3, name: "Project Gamma", description: "Description for Project Gamma" },
];

const mockTasks = [
    { id: 1, title: "Task One", description: "Description for Task One" },
    { id: 2, title: "Task Two", description: "Description for Task Two" },
    { id: 3, title: "Task Three", description: "Description for Task Three" },
];

function Homepage() {
    const isMobile = useIsMobile();
    return (
        <SidebarProvider>
          <AppSidebar className="bg-sidebar" />
          <SidebarInset>

            <header className="sticky top-0 z-10 flex h-16 items-center bg-background ">
              <SidebarTrigger />
            </header>

            <div className="flex-1 px-4 overflow-auto">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold">Welcome back, User!</h1>
                        </div>
                        
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold">Your Current Projects</h2>
                            <div className="w-full h-0.5 bg-gray-300 my-2" />
                        </div>
                        <div className={`flex flex-wrap gap-4 ${isMobile ? "flex-col" : ""}`}>
                            {mockProjects.map((project) => (
                            <Card key={project.id} className={`${isMobile ? "w-full" : "w-[calc(33.33%-1rem)]"} h-52`}>
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                </CardHeader>
                                <CardContent>{project.description}</CardContent>
                            </Card>
                            ))}
                        </div>
                    </div>
    
                {/* Tasks section - now in list format */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold">Your Current Tasks</h2>
                        <div className="w-full h-0.5 bg-gray-300 my-2" />
                    </div>
                    <div className="rounded-md border">
                        <ul className="divide-y">
                            {mockTasks.map((task) => (
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
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )
}

export default Homepage;