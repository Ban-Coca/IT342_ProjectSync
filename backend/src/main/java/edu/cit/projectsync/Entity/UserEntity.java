package edu.cit.projectsync.Entity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String provider; // e.g., "email", "facebook", "google"
    private boolean isActive = true;
    private Date createdAt;
    private Date lastLogin;
    private Date updatedAt;

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskEntity> tasks;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectEntity> projects;

    public UserEntity() {
        // Default constructor
    }

    public UserEntity(String email, String firstName, String lastName, String password, String provider, Date createdAt, Date lastLogin, Date updatedAt) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.provider = provider;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public boolean IsActive() {
        return isActive;
    }

    public void setIsActive(boolean active) {
        isActive = active;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public List<TaskEntity> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskEntity> tasks) {
        this.tasks = tasks;
    }

    public List<ProjectEntity> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectEntity> projects) {
        this.projects = projects;
    }
}