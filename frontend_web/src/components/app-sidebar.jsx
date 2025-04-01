import { Calendar, Home, Inbox, Search, Settings, LayoutDashboard  } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom";

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
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: Search,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ]
  
  export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
      if (path === "/" && location.pathname === "/") {
        return true
      }
  
      if (path !== "/" && location.pathname.startsWith(path)) {
        return true
      }
  
      return false
    }
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
        <SidebarFooter>
          <button className="w-full h-12 text-base">Logout</button>
        </SidebarFooter>
      </Sidebar>
    )
  }
  
