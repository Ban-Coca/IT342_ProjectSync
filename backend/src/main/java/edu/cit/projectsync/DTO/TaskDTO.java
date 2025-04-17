package edu.cit.projectsync.DTO;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class TaskDTO{
    private UUID taskId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String status;
    private ProjectDTO project;
    private List<UserDTO> assignedTo;

    public TaskDTO() {
    }

    // Getters and Setters
    public UUID getTaskId() {
        return taskId;
    }
    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDate getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public ProjectDTO getProject() {
        return project;
    }
    public void setProject(ProjectDTO project) {
        this.project = project;
    }
    public List<UserDTO> getAssignedTo() {
        return assignedTo;
    }
    public void setAssignedTo(List<UserDTO> assignedTo) {
        this.assignedTo = assignedTo;
    }
}