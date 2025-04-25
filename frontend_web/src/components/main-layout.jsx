import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/app-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { Bell, BellDot } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";

const MainLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar className="bg-sidebar-foreground"/>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background border-b border-border p-4 shadow-sm">
          <SidebarTrigger className="-ml-1"/>
          <Separator className="mx-4 h-6 w-px bg-border" orientation="vertical" />
          <div className="flex w-full justify-end">
            <NotificationDropdown/>
          </div>
        </header>
        <div className="flex-1 px-4 overflow-auto">
          <div className="container mx-auto px-4">
            {/* Main content goes here */}
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;