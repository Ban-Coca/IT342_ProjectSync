package edu.cit.projectsync.DTO;

import java.util.UUID;

public class DeviceRegistrationRequest {
    private String token;
    private UUID userId;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }


    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

