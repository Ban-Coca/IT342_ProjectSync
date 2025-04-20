import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2Icon, Flag, Users, PencilIcon, Save, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getPriorityColor, getStatusIcon } from "@/utils/task-utils"
import { useTask } from "@/hooks/use-task"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/authentication-context"
import DeleteModal from "./delete-modal"
import { useProject } from "@/hooks/use-project"

export default function TaskViewCard({ open, taskId, onOpenChange }) {
    const [isEditMode, setIsEditMode] = useState(false)
    const queryClient = useQueryClient()
    const { currentUser, getAuthHeader } = useAuth()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    
    const {
        task,
        editTaskMutation,
        deleteTaskMutation
    } = useTask({
        taskId,
        getAuthHeader,
        currentUser,
        queryClient,
        onUpdateSuccess: () => {
            setIsEditMode(false)
        },
        onDeleteSuccess: () => {
            setDeleteDialogOpen(false)
            onOpenChange(false)
        }
    })
    const { project } = useProject({ projectId: task?.project?.projectId, getAuthHeader, currentUser })
    const [editedTask, setEditedTask] = useState(task ? { ...task } : {})
    const [selectedDate, setSelectedDate] = useState(task?.dueDate ? new Date(task.dueDate) : null)    
    const formattedDate = task?.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"

    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [teamMembers, setTeamMembers] = useState([]);

    const filteredTeamMembers = searchTerm?.trim() === '' ? 
        teamMembers : 
        teamMembers.filter(member => 
            (member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            member.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !editedTask.assignedTo?.some(assigned => assigned.userId === member.userId)
        );

    useEffect(() => {
        if (project) {
            setTeamMembers(project.teamMemberIds);
        }
    }, [project]);

    const assignUser = (user) => {
        setEditedTask(prev => ({
            ...prev,
            assignedTo: [...(prev.assignedTo || []), user]
        }));
        setSearchTerm('');
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        if (task) {
            setEditedTask({ ...task });
            setSelectedDate(task.dueDate ? new Date(task.dueDate) : null);
        }
    }, [task]);

    const handleEditToggle = () => {
        if (isEditMode) {
        // Cancel edit - reset form
            setEditedTask({ ...task })
            setSelectedDate(task.dueDate ? new Date(task.dueDate) : null)
        }
        setIsEditMode(!isEditMode)
    }

    const handleSave = () => {
        console.log("Saving task changes:", editedTask)
        editTaskMutation.mutate(editedTask, {
            onSuccess: (updatedData) => {
                setEditedTask(updatedData);
                queryClient.invalidateQueries(['tasks', task.project.projectId]);
                setIsEditMode(false);
            }
        });
        
    }
    const handleDelete = () => {
        deleteTaskMutation.mutate(taskId)
    }
    const handleInputChange = (field, value) => {
        setEditedTask({
        ...editedTask,
        [field]: value,
        })
    }
    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true)
    }
    const handleDateSelect = (date) => {
        setSelectedDate(date)
        if (date) {
        const formattedDate = date.toISOString().split("T")[0]
        handleInputChange("dueDate", formattedDate)
        } else {
        handleInputChange("dueDate", null)
        }
    }

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
                    <SheetHeader className="space-y-2 mt-4 pb-4">
                        <div className="flex items-center justify-between">
                            {isEditMode ? (
                            <Input
                                value={editedTask.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                className="text-xl font-bold"
                                placeholder="Task title"
                            />
                            ) : (
                            <SheetTitle className="text-xl font-bold">{task?.title}</SheetTitle>
                            )}

                        </div>

                        {isEditMode ? (
                            <Textarea
                            value={editedTask.description || ""}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Add a description"
                            className="resize-none"
                            rows={3}
                            />
                        ) : (
                            <SheetDescription className="text-sm text-muted-foreground">
                            {task?.description || "No description provided"}
                            </SheetDescription>
                        )}
                    </SheetHeader>

                    <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center space-x-3 p-3 rounded-md bg-slate-50">
                                <CheckCircle2Icon className="h-5 w-5 text-slate-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Project</p>
                                    <p className="text-sm text-slate-500 mt-1">{task?.project?.name || "No project"}</p>
                                </div>
                            </div>
                            {/* Due Date */}
                            <div className="flex items-center space-x-3 p-3 rounded-md bg-slate-50">
                            <CalendarIcon className="h-5 w-5 text-slate-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Due Date</p>
                                    {isEditMode ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button variant="outline" className="mt-1 w-full justify-start text-left font-normal">
                                            {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a date"}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    ) : (
                                        <p className="text-sm text-slate-500">{formattedDate}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-md bg-slate-50">
                                <Flag className="h-5 w-5 text-slate-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Priority</p>
                                    {isEditMode ? (
                                    <Select value={editedTask.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                                        <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    ) : (
                                    <Badge className={`mt-1 ${getPriorityColor(task?.priority) || "bg-slate-200"}`}>{task?.priority}</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 rounded-md bg-slate-50">
                                <CheckCircle2Icon className="h-5 w-5 text-slate-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Status</p>
                                    {isEditMode ? (
                                    <Select value={editedTask.status} onValueChange={(value) => handleInputChange("status", value)}>
                                        <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="To Do">To Do</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                        <SelectItem value="Blocked">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    ) : (
                                    <Badge className={`mt-1 ${getStatusIcon(task?.status) || "bg-slate-200"}`}>   
                                        {task?.status}
                                    </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 rounded-md bg-slate-50">
                                <Users className="h-5 w-5 text-slate-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Assigned To</p>
                                    {isEditMode ? (
                                        <div className="mt-2 space-y-3">
                                            {/* Display currently assigned users */}
                                            {editedTask?.assignedTo && editedTask?.assignedTo.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {editedTask.assignedTo.map((user, index) => (
                                                        <div 
                                                            key={index} 
                                                            className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"
                                                        >
                                                            <span>{user.firstName}</span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-4 w-4 p-0"
                                                                onClick={() => {
                                                                    setEditedTask({
                                                                        ...editedTask,
                                                                        assignedTo: editedTask.assignedTo.filter((_, i) => i !== index)
                                                                    });
                                                                }}
                                                            >
                                                                <X className="h-3 w-3" />
                                                                <span className="sr-only">Remove {user.firstName}</span>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Search input for assigning users */}
                                            <div className="relative">
                                                <Input
                                                    placeholder="Search to assign users..."
                                                    value={searchTerm || ""}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onFocus={() => setIsDropdownOpen(true)}
                                                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                                />
                                                
                                                {/* Dropdown results */}
                                                {isDropdownOpen && filteredTeamMembers.length > 0 && (
                                                    <div 
                                                        className="absolute w-full mt-1 max-h-60 overflow-auto z-10 bg-white border border-gray-200 rounded-md shadow-lg"
                                                    >
                                                        {filteredTeamMembers.map((user) => (
                                                            <div
                                                                key={user.userId}
                                                                className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    assignUser(user);
                                                                }}
                                                            >
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : task?.assignedTo && task?.assignedTo.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {task.assignedTo.map((user, index) => (
                                            <Avatar key={index} className="h-8 w-8">
                                                <AvatarFallback>{user.firstName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 mt-1">Not assigned</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                            <Button variant="destructive" onClick={handleDeleteDialogOpen} >
                                <X className="h-4 w-4" /> Delete Task
                            </Button>
                            <Button variant="outline" onClick={handleEditToggle}>
                                {isEditMode ? "Cancel Update" : "Update Task"}
                            </Button>
                            {isEditMode ? (
                                <Button onClick={handleSave} className="gap-1">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            ) : (
                                <Button onClick={() => handleInputChange("status", "Done")}>
                                    Mark Complete
                                </Button>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <DeleteModal
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onDelete={handleDelete}
                entityType="task"
                task={task}
            />
        </>
    )
}
