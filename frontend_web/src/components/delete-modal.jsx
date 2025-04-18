import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export default function DeleteModal({ 
    open, 
    onOpenChange, 
    onDelete,
    entityType = "project",
    project = null,
    task = null,
    document = null,
}) {
    const getTitle = () => {
        return `Delete ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`;
      };
    
      const getDescription = () => {
        let baseText = `Are you sure you want to delete this ${entityType}?`;
        if (project && project.name) {
          baseText = `Are you sure you want to delete "${project.name}"?`;
        }
        return `${baseText} This action cannot be undone.`;
      };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                    <DialogDescription>
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        if(project){
                            console.log("Deleting project:", project.projectId);
                            onDelete(project.projectId);
                        }
                    }}>
                        Delete
                    </Button>
                </div>
        </DialogContent>
        </Dialog>
    );
}