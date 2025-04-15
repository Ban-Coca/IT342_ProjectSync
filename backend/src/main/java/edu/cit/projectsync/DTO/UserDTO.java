package edu.cit.projectsync.DTO;

import java.util.Date;
import java.util.List;

public class UserDTO {

    private int userId;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isActive;
    private Date createdAt;
    private Date lastLogin;
    private List<ProjectDTO> projects; // Include full project details if needed
    private List<Integer> teamProjectIds; // IDs of projects where the user is a team member

    // Getters and Setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
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

    public List<Integer> getTeamProjectIds() {
        return teamProjectIds;
    }

    public void setTeamProjectIds(List<Integer> teamProjectIds) {
        this.teamProjectIds = teamProjectIds;
    }

    public List<ProjectDTO> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDTO> projects) {
        this.projects = projects;
    }
}