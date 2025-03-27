package edu.cit.projectsync.DTO;

import edu.cit.projectsync.Entity.UserEntity;

public class LoginResponse {
    private String token;
    private UserEntity user;

    public LoginResponse(String token, UserEntity user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}