import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bell, Check, CheckCheck, Clock, Info, AlertTriangle, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import MainLayout from "@/components/main-layout"
import { useNotification } from "@/hooks/use-notification"
import { useAuth } from "@/contexts/authentication-context"
import { useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsPage() {
    const { currentUser, getAuthHeader } = useAuth()
    const queryClient = useQueryClient()
    const { 
        notifications, 
        unread, 
        unreadCount, 
        markAllAsReadMutation, 
        readNotificationMutation,
        isLoadingNotifications,
        isLoadingUnread 
    } = useNotification({
        currentUser,
        queryClient,    
        getAuthHeader,
    })
    console.log("Notifications:", notifications)
    console.log("Unread:", unread)
    const handleMarkAsRead = (id) => {
        readNotificationMutation.mutate(id)
    }
    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate()
    }
    const getIconForType = (type) => {
        switch (type) {
            case "info": return <Info className="h-4 w-4" />;
            case "success": return <CheckCircle className="h-4 w-4" />;
            case "warning": return <AlertTriangle className="h-4 w-4" />;
            case "error": return <AlertCircle className="h-4 w-4" />;
            default: return <Bell className="h-4 w-4" />;
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
            icon: getIconForType(notification.type || "info")
        }));
    }

    // Format notifications for display
    const formattedNotifications = formatNotifications(notifications?.content || []);
    const formattedUnread = formatNotifications(unread || []);

    return (
        <MainLayout>
            <div className="space-y-6 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground">View and manage your notifications</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsReadMutation.isPending}
                    >
                        {markAllAsReadMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCheck className="mr-2 h-4 w-4" />
                        )}
                        Mark all as read
                    </Button>
                    <Button variant="outline" size="sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Clear history
                    </Button>
                    </div>
                </div>

                <Tabs defaultValue="all">
                    <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="unread">Unread</TabsTrigger>
                    </TabsList>
                    </div>
                    <TabsContent value="all" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle>All notifications</CardTitle>
                                <CardDescription>View all your activity and system notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-0">
                                {isLoadingNotifications ? (
                                    <NotificationSkeleton count={3} />
                                ) : formattedNotifications.length > 0 ? (
                                    formattedNotifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            {...notification}
                                            onMarkAsRead={() => handleMarkAsRead(notification.id)}
                                        />
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted-foreground">
                                        No notifications to display
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </TabsContent>
                    <TabsContent value="unread" className="mt-4">
                        <Card>
                            <CardHeader className="pb-3">
                            <CardTitle>Unread Notifications</CardTitle>
                            <CardDescription>Notifications you haven't read yet</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-0">
                                {isLoadingUnread ? (
                                    <NotificationSkeleton count={2} />
                                ) : formattedUnread.length > 0 ? (
                                    formattedUnread.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            {...notification}
                                            onMarkAsRead={() => handleMarkAsRead(notification.id)}
                                        />
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted-foreground">
                                        No unread notifications
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    )
}

function NotificationSkeleton({ count = 3 }) {
  return Array(count).fill(0).map((_, index) => (
    <div key={index} className="flex items-start gap-4 p-4 border-b last:border-0 animate-pulse">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  ));
}

function NotificationItem({ icon, title, description, time, type, read, onMarkAsRead }) {
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

  return (
    <div className={`flex items-start gap-4 p-4 border-b last:border-0 ${!read ? "bg-muted/50" : ""}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getTypeStyles(type)}`}>
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-none">{title}</p>
          {!read && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={onMarkAsRead}
              disabled={readNotificationMutation?.isPending}
            >
              {readNotificationMutation?.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
