import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, FlagIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function DetailsView({project, onProjectUpdate}){

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-4">
            <div className="col-span-2 row-span-5">
                <Card className="w-full h-96">
                    <CardContent className="flex flex-col justify-center items-start">
                        <div className="flex flex-col items-start" >
                            <CardHeader className="flex flex-col items-start px-0">
                                <CardTitle className="text-xl font-bold">Description</CardTitle>
                            </CardHeader>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        <div className="flex flex-col items-start mt-4">
                            <CardHeader className="flex flex-col items-start px-0">
                                <CardTitle className="text-xl font-bold">Project Timeline</CardTitle>
                            </CardHeader>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Created on {formatDate(project.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FlagIcon className="h-4 w-4" />
                                <span>Due by {formatDate(project.endDate)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-2 row-span-2 col-start-3">
                <Card className="w-full h-48">
                    {project.teamMemberIds.length === 0 ? (
                        <CardContent className="flex flex-col justify-center items-center h-full">
                            <div className="text-lg font-semibold">There are currently no members on this project</div>
                            <Button className="mt-4" onClick={() => alert("Add members functionality")}>
                                Add Members
                            </Button>
                        </CardContent>
                    ) : (
                        <CardContent className="flex flex-col justify-center items-start">
                            <CardHeader className="flex flex-col items-start px-0">
                                <CardTitle className="text-xl font-bold">Team Members</CardTitle>
                            </CardHeader>
                            <div className="flex items-center gap-2 mt-4">
                                {project.teamMemberIds.map((member) => (
                                    <div key={member.userId} className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-muted-foreground">{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
            <div className="col-span-2 row-span-2 col-start-3 row-start-3">
                <Card>
                    <CardHeader className="flex flex-col items-start">
                        <CardTitle className="text-xl font-bold">Project Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center items-start h-full">
                        {project.goals.length === 0 ? (
                            <div className="text-lg font-semibold">No goals set for this project</div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {project.goals.map((goal, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-2">
                                        {goal}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}