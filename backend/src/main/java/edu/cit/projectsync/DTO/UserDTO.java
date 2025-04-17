package edu.cit.projectsync.DTO;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public class UserDTO {

    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isActive;
    private Date createdAt;
    private Date lastLogin;
    private List<UUID> projects;
    private List<UUID> teamProjectIds;
    private List<UUID> tasks;
    private List<UUID> documents;

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public List<UUID> getTeamProjectIds() {
        return teamProjectIds;
    }

    public void setTeamProjectIds(List<UUID> teamProjectIds) {
        this.teamProjectIds = teamProjectIds;
    }

    public List<UUID> getProjects() {
        return projects;
    }

    public void setProjects(List<UUID> projects) {
        this.projects = projects;
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