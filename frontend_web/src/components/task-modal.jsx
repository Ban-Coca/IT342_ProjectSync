import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useTask } from "@/hooks/use-task";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskModal({
    open,
    onOpenChange,
    onSubmit,
    task = null,
    availableUsers = [],
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState([]);

    const isEditMode = !!task;

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
            assignedTo: assignedTo.map((user) => user.id),
        };

        if (isEditMode) {
            taskData.taskId = task.taskId;
        }

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
                            <Select 
                                value={assignedTo} 
                                onValueChange={(value) => {
                                    // Only update if the value is different to prevent loops
                                    const newValue = Array.isArray(value) ? value : [value];
                                    if (JSON.stringify(newValue) !== JSON.stringify(assignedTo)) {
                                        setAssignedTo(newValue);
                                    }
                                }}
                                multiple
                            >
                                <SelectTrigger id="assignedTo">
                                    <SelectValue placeholder="Select team members" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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