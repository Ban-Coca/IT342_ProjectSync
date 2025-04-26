import { useEffect, useState, useRef } from "react"
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
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/contexts/authentication-context";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/components/loading-state";
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

  const queryClient = useQueryClient();
  const { getAuthHeader } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const isEditMode = !!project

  useEffect(() => {
      if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
          setDebouncedSearchTerm(searchTerm.trim());
      }, 300);
      
      return () => {
          if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
          }
      };
  }, [searchTerm]);

  const { searchQuery, isLoading, isError } = useUser({
      keyword: debouncedSearchTerm,
      queryClient,
      getAuthHeader,
  })

  const filteredUsers = searchQuery?.data ? 
    searchQuery.data.filter(user => 
      !teamMembers.some(member => member.userId === user.userId)
    ) : [];

  useEffect(() => {
    if(project){
      setName(project.name || "")
      setDescription(project.description || "")
      setStartDate(project.startDate || "")
      setEndDate(project.endDate || "")
      setGoals(project.goals || [])

      if (project.teamMemberIds && Array.isArray(project.teamMemberIds)) {
        const teamMemberObjects = project.teamMemberIds.map(id => {
          const user = availableUsers.find(u => u.userId === id) || { userId: id, name: `User ${id}` };
          return user;
        });
        setTeamMembers(teamMemberObjects);
      } else {
        setTeamMembers(project.teamMembers || []);
      }
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
    setSearchTerm("");
  };
  const handleSubmit = (e) => {
    e.preventDefault()

    const projectData = {
      name,
      description,
      startDate: startDate || null,
      endDate: endDate || null,
      goals,
      teamMemberIds: teamMembers.map(member => ({userId: member.userId})),
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

  const addTeamMember = (user) => {
    
    if (!teamMembers.some(member => member.userId === user.userId)) {
      
      const newMember = {
        userId: user.userId,
        name: user.firstName
      };
      setTeamMembers([...teamMembers, newMember]);
    }
    setSearchTerm('');
    const inputElement = document.getElementById('teamMembers');
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleTeamMemberChange = (userId) => {
    if (!teamMembers.includes(userId)) {
      setTeamMembers([...teamMembers, userId])
    }
  }

  const removeTeamMember = (userId) => {
    setTeamMembers(teamMembers.filter(member => member.userId !== userId))
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

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Team Members</Label>
              <div className="col-span-3 space-y-3">
                {/* Team members search input */}
                <div className="relative">
                  <Input
                    id="teamMembers"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 300)}
                    aria-autocomplete="list"
                    aria-controls="user-search-results"
                    aria-expanded={isDropdownOpen}
                  />
                  
                  {/* Loading indicator */}
                  {isLoading && debouncedSearchTerm && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loading className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Dropdown results */}
                  {isDropdownOpen && filteredUsers.length > 0 && (
                    <div 
                      id="user-search-results"
                      className="absolute w-full mt-1 max-h-60 overflow-auto z-10 bg-white border border-gray-200 rounded-md shadow-lg"
                      role="listbox"
                    >
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                          role="option"
                          aria-selected="false"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            addTeamMember(user);
                          }}
                        >
                          <p className="text-black">{user.firstName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Status messages */}
                {isDropdownOpen && debouncedSearchTerm && !isLoading && filteredUsers.length === 0 && (
                  <p className="text-sm text-gray-500">No matching users found</p>
                )}
                
                {isError && (
                  <p className="text-sm text-red-500">Error loading users. Please try again.</p>
                )}
                
                {debouncedSearchTerm && debouncedSearchTerm.length < 2 && (
                  <p className="text-sm text-gray-500">Type at least 2 characters to search</p>
                )}

                {/* Display selected team members */}
                {teamMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teamMembers.map((member) => (
                      <Badge key={member.userId} variant="secondary" className="flex items-center gap-1">
                        {member.name}
                        <button
                          type="button"
                          onClick={() => removeTeamMember(member.userId)}
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
          </div>
          <DialogFooter>
            <Button type="submit">{isEditMode ? "Update Project" : "Create Project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
