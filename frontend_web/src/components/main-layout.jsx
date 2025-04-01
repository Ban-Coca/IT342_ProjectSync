import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/app-sidebar";

const MainLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar className="bg-sidebar" />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background ">
          <SidebarTrigger />
        </header>
        <div className="flex-1 px-4 overflow-auto">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;