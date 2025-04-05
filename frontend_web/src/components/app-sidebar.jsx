import { Calendar, Home, Inbox, Search, Settings, LayoutDashboard, ClipboardList   } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import NavUser from "@/components/nav-user"
const items = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ClipboardList,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ]
  
  export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const { state } = useSidebar()
    const isActive = (path) => {
      if (path === "/" && location.pathname === "/") {
        return true
      }
  
      if (path !== "/" && location.pathname.startsWith(path)) {
        return true
      }
  
      return false
    }
    const handleLogout = () => {
      logout(); // Call the logout function
      navigate("/login"); // Redirect to the login page
    };
    return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-2xl text-black p-4 font-bold mt-5">
              ProjectSync
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="mt-6">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className="text-base h-12 hover:bg-gray-300" isActive={isActive(item.url)}asChild>
                      <a href={item.url} className="gap-4">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter >
          <NavUser currentUser={currentUser} onLogout={handleLogout} isCollapsed={state === "collapsed"} />
        </SidebarFooter>
      </Sidebar>
    )
  }
  
