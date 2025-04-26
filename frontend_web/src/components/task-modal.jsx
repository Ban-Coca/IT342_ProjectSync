import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/contexts/authentication-context";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "./loading-state";
import { X } from "lucide-react";
export default function TaskModal({
    open,
    onOpenChange,
    onSubmit,
    task = null,
    teamMembers = [],
    projectOwner = null,
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isEditMode = !!task;

    const allAssignableMembers = [...teamMembers];
    
    // Add project owner to assignable members if provided and not already included
    if (projectOwner && !allAssignableMembers.some(member => member.userId === projectOwner.userId)) {
        allAssignableMembers.push(projectOwner);
    }

    const filteredTeamMembers = searchTerm.trim() === '' ? 
        [] : 
        allAssignableMembers.filter(member => 
            (member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             member.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !assignedTo.some(assigned => assigned.userId === member.userId)
        );

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setDueDate(task.dueDate || "");
            setStatus(task.status || "");
            setPriority(task.priority || "");
            setAssignedTo(task.assignedTo || []);
        } else {
            resetForm()
        }
    }, [task]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("");
        setPriority("");
        setAssignedTo([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const taskData = {
            title,
            description,
            dueDate,
            status,
            priority,
            assignedTo: assignedTo.map((user) => ({userId: user.userId})),
        };

        if (isEditMode) {
            taskData.taskId = task.taskId;
        }
        console.log("taskData", taskData);
        onSubmit(taskData, isEditMode);
        resetForm();
        onOpenChange(false);
    }

    useEffect(() => {
        if (!open) {
          
          const cleanup = () => {
            document.body.style.pointerEvents = '';
          };
          
          setTimeout(cleanup, 100);
          return cleanup;
        }
      }, [open]);

    const assignUser = (user) => {
        setAssignedTo(prev => [...prev, user]);
        setSearchTerm('');
        
    };
    
    const removeUser = (userId) => {
        setAssignedTo(prev => prev.filter(user => user.userId !== userId));
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex flex-col items-start">
                            <DialogTitle className="text-lg font-semibold">{isEditMode ? "Edit Task" : "Create Task"}</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                {isEditMode ? "Edit your task details." : "Fill in the details to create a new task."}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input 
                                id="title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Task title" 
                                required 
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                placeholder="Describe the task" 
                                rows={3} 
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input 
                                id="dueDate" 
                                type="date" 
                                value={dueDate} 
                                onChange={(e) => setDueDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="To Do">To Do</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Set priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="assignedTo">Assign To</Label>
                            
                            {/* Selected users display */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {assignedTo.map(user => (
                                    <div 
                                        key={user.userId} 
                                        className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"
                                    >
                                        <span>{user.firstName}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0"
                                            onClick={() => removeUser(user.userId)}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove {user.firstName}</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Search input */}
                            <div className="relative">
                                <Input
                                    id="assignedTo"
                                    placeholder="Search team members..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                    aria-autocomplete="list"
                                    aria-controls="user-search-results"
                                    aria-expanded={isDropdownOpen}
                                />
                                
                                {/* Dropdown results */}
                                {isDropdownOpen && filteredTeamMembers.length > 0 && (
                                    <div 
                                        id="user-search-results"
                                        className="absolute w-full mt-1 max-h-60 overflow-auto z-10 bg-white border border-gray-200 rounded-md shadow-lg"
                                        role="listbox"
                                    >
                                        {filteredTeamMembers.map(user => (
                                            <div
                                                key={user.userId}
                                                className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                                                role="option"
                                                aria-selected="false"
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
                            
                            {/* Status messages */}
                            {isDropdownOpen && searchTerm && filteredTeamMembers.length === 0 && (
                                <p className="text-sm text-gray-500">No matching team members found</p>
                            )}
                            
                            {teamMembers.length === 0 && (
                                <p className="text-sm text-gray-500">No team members available for this project</p>
                            )}
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEditMode ? "Save Changes" : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}