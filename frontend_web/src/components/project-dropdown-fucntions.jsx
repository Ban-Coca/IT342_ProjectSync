import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
export function ProjectDropdown({project, onEdit, onDelete}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // This is the key fix - properly manage the dropdown state
  const handleAction = (action) => {
    // First close the dropdown
    setOpen(false);
    
    // Then use a small timeout before triggering the action
    setTimeout(() => {
      action();
    }, 50);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-primary hover:text-white"
            onClick={(e) => e.stopPropagation()}
        >
            <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent ref={dropdownRef} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-red-500 focus:text-white" 
            onClick={(e) => {
              e.stopPropagation()
              handleAction(() => onDelete && onDelete(project));
            }}>
            Delete Project
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              handleAction(() => onEdit && onEdit(project));
            }}>
            Edit Project Details
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
