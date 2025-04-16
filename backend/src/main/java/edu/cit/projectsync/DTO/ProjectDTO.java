package edu.cit.projectsync.DTO;

import java.time.LocalDate;
import java.util.List;

public class ProjectDTO {

    private int projectId;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int ownerId; // Include the owner's ID
    private List<String> goals; // Include project goals
    private List<Integer> teamMemberIds; // Only include user IDs for team members

    // Getters and Setters
    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
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

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public List<String> getGoals() {
        return goals;
    }

    public void setGoals(List<String> goals) {
        this.goals = goals;
    }

    public List<Integer> getTeamMemberIds() {
        return teamMemberIds;
    }

    public void setTeamMemberIds(List<Integer> teamMemberIds) {
        this.teamMemberIds = teamMemberIds;
    }
}