package edu.cit.projectsync.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
public class VerificationCodeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private String resetToken;

    public UUID getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public String getCode() {
        return code;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
