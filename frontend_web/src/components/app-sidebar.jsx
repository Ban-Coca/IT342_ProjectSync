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

const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ]
  
  export default function AppSidebar() {
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
                    <SidebarMenuButton className="text-base h-12 hover:bg-gray-300"asChild>
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
  
