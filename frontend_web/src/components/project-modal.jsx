import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProjectModal({
  open,
  onOpenChange,
  onSubmit,
  project = null,
  availableUsers = [], 
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [goals, setGoals] = useState([])
  const [currentGoal, setCurrentGoal] = useState("")
  const [teamMembers, setTeamMembers] = useState([])

  const isEditMode = !!project

  useEffect(() => {
    if(project){
      setName(project.name || "")
      setDescription(project.description || "")
      setStartDate(project.startDate || "")
      setEndDate(project.endDate || "")
      setGoals(project.goals || [])
      setTeamMembers(project.teamMemberIds || [])
    } else {
      resetForm()
    }
  }, [project])

  const resetForm = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setGoals([]);
    setCurrentGoal("");
    setTeamMembers([]);
  };
  const handleSubmit = (e) => {
    e.preventDefault()

    const projectData = {
      name,
      description,
      startDate: startDate || null,
      endDate: endDate || null,
      goals,
      teamMembers,
    }
    if(isEditMode){
      projectData.projectId = project.projectId
    }
    onSubmit(projectData, isEditMode)
    resetForm()
    onOpenChange(false)
  }

  const addGoal = () => {
    if (currentGoal.trim()) {
      setGoals([...goals, currentGoal.trim()])
      setCurrentGoal("")
    }
  }

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index))
  }

  const handleTeamMemberChange = (userId) => {
    if (!teamMembers.includes(userId)) {
      setTeamMembers([...teamMembers, userId])
    }
  }

  const removeTeamMember = (userId) => {
    setTeamMembers(teamMembers.filter((id) => id !== userId))
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
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the project details below." : "Fill in the details below to create your new project."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Project Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Project name"
                required
              />
            </div>

            {/* Project Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Brief description of your project"
              />
            </div>

            {/* Start Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                  min={startDate} // Prevent selecting dates before start date
                />
              </div>
            </div>

            {/* Project Goals */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Goals</Label>
              <div className="col-span-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={currentGoal}
                    onChange={(e) => setCurrentGoal(e.target.value)}
                    placeholder="Add a project goal"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addGoal()
                      }
                    }}
                  />
                  <Button type="button" size="icon" onClick={addGoal}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {goals.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {goals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {goal}
                        <button
                          type="button"
                          onClick={() => removeGoal(index)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Team Members */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Team Members</Label>
              <div className="col-span-3 space-y-3">
                <Select onValueChange={handleTeamMemberChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add team members" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers
                      .filter((user) => !teamMembers.includes(user.userId))
                      .map((user) => (
                        <SelectItem key={user.userId} value={user.userId}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {teamMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map((userId) => {
                      const user = availableUsers.find((u) => u.userId === userId)
                      return (
                        <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                          {user?.name || userId}
                          <button
                            type="button"
                            onClick={() => removeTeamMember(userId)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditMode ? "Update Project" : "Create Project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
