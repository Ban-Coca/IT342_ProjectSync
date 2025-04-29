import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail} from "lucide-react"

export function UserProfileHeader({ user }) {

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName.charAt(0) : '';
        const lastInitial = lastName ? lastName.charAt(0) : '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">
                        {user?.firstName} {user?.lastName}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
                        <div className="flex flex-col items-start">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
