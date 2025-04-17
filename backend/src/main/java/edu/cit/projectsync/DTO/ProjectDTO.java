package edu.cit.projectsync.DTO;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.hibernate.internal.util.type.PrimitiveWrapperHelper;

public class ProjectDTO {

    private UUID projectId;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private UserDTO ownerId;
    private List<String> goals; 
    private List<UserDTO> teamMemberIds;
    private List<UUID> tasks;
    private List<UUID> documents;

    // Getters and Setters
    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public UserDTO getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UserDTO ownerId) {
        this.ownerId = ownerId;
    }

    public List<String> getGoals() {
        return goals;
    }

    public void setGoals(List<String> goals) {
        this.goals = goals;
    }

    public List<UserDTO> getTeamMemberIds() {
        return teamMemberIds;
    }

    public void setTeamMemberIds(List<UserDTO> teamMemberIds) {
        this.teamMemberIds = teamMemberIds;
    }

    public List<UUID> getTasks() {
        return tasks;
    }

    public void setTasks(List<UUID> tasks) {
        this.tasks = tasks;
    }

    public List<UUID> getDocuments() {
        return documents;
    }

    public void setDocuments(List<UUID> documents) {
        this.documents = documents;
    }
}