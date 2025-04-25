import { useState } from "react"
import { Bell, BellOff, Check, Weight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {Link} from "react-router-dom"
import { useAuth } from "@/contexts/authentication-context"
import { useQueryClient } from "@tanstack/react-query"
import { useNotification } from "@/hooks/use-notification"
export function NotificationDropdown() {
    const { currentUser, getAuthHeader } = useAuth()
    const queryClient = useQueryClient()
    const { 
        notifications, 
        unread, 
        unreadCount, 
        markAllAsReadMutation, 
        readNotificationMutation 
    } = useNotification({
        currentUser,
        queryClient,
        getAuthHeader,
    })

    const markAsRead = (id) => {
        readNotificationMutation.mutate(id, {
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications", currentUser?.userId])
            queryClient.invalidateQueries(["unreadCount", currentUser?.userId])
            queryClient.invalidateQueries(["unread", currentUser?.userId])
        },
        })
    }

    const markAllAsRead = () => {
        markAllAsReadMutation.mutate(null, {
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications", currentUser?.userId])
            queryClient.invalidateQueries(["unreadCount", currentUser?.userId])
            queryClient.invalidateQueries(["unread", currentUser?.userId])
        },
        })
    }

    const getTypeStyles = (type) => {
        switch (type) {
        case "info":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20"
        case "success":
            return "bg-green-500/10 text-green-500 border-green-500/20"
        case "warning":
            return "bg-amber-500/10 text-amber-500 border-amber-500/20"
        case "error":
            return "bg-red-500/10 text-red-500 border-red-500/20"
        default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/20"
        }
    }
    const formatNotifications = (apiNotifications) => {
        if (!Array.isArray(apiNotifications)) return [];
        
        return apiNotifications.map(notification => ({
            id: notification.id,
            title: notification.title,
            description: notification.message || notification.description,
            time: new Date(notification.createdAt).toLocaleString(),
            type: notification.type || "info",
            read: notification.read,
        }));
    }

    // Format notifications for display
    const formattedNotifications = formatNotifications(notifications?.content || []);
    const formattedUnread = formatNotifications(unread || []);
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {unreadCount?.count > 0 ? (
                  <>
                    <Bell className="absolute h-10 w-10" style={{ height: "20px", width: "20px", fontWeight: "bold"}}/>
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                      variant="destructive"
                    >
                      {unreadCount.count}
                    </Badge>
                  </>
                ) : (
                  <Bell className="h-10 w-10" style={{ height: "20px", width: "20px", fontWeight: "bold"}}/>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-1 text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
            <div>
              {formattedNotifications.length > 0 ? (
                formattedNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex gap-3 p-3 border-b last:border-0 transition-colors",
                            notification.read ? "bg-background" : "bg-muted/50",
                        )}
                    >
                        <div
                            className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", notification.read ? "bg-muted" : "bg-primary")}
                        />
                        <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                            {!notification.read && (
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => markAsRead(notification.id)}
                                >
                                <Check className="h-3 w-3" />
                                <span className="sr-only">Mark as read</span>
                                </Button>
                            )}
                            </div>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                    </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <BellOff className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm font-medium">No notifications</p>
                    <p className="text-xs text-muted-foreground">You're all caught up!</p>
                </div>
              )}
            </div>
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
