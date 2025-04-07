import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/app-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Toaster } from "sonner";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
const MainLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar className="bg-sidebar" />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background border-b border-border p-4 shadow-sm">
          <SidebarTrigger className="-ml-1"/>
          <Separator className="mx-4 h-6 w-px bg-border" orientation="vertical" />
          <div className="relative flex-1 flex justify-end">
            <Input
              placeholder="Search..."
              className="w-full max-w-sm"
              onChange={(e) => console.log(e.target.value)}
              />
            <Search className="absolute right-2 top-2 text-muted-foreground" />
          </div>
        </header>
        <div className="flex-1 px-4 overflow-auto">
          <div className="container mx-auto px-4">
            {/* Main content goes here */}
            <Toaster richColors/>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;