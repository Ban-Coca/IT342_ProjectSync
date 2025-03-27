package edu.cit.projectsync.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.projectsync.DTO.LoginResponse;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(@RequestBody UserEntity user) {
        Optional<UserEntity> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(null); // Email already exists
        }
        UserEntity registeredUser = userService.registerUser(user);
        return ResponseEntity.status(201).body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody UserEntity loginRequest) {
        Optional<UserEntity> userOptional = userService.findByEmail(loginRequest.getEmail());
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            if (userService.checkPassword(user, loginRequest.getPassword())) {
                // Generate a token (mocked here for simplicity)
                String token = "mocked-jwt-token";
                return ResponseEntity.ok(new LoginResponse(token, user));
            }
        }
        return ResponseEntity.status(401).body(null);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody String email) {
        Optional<UserEntity> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            // Mock sending a reset link
            return ResponseEntity.ok("Password reset link sent to " + email);
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam("email") String email,
            @RequestParam("old_password") String oldPassword,
            @RequestParam("new_password") String newPassword) {
        Optional<UserEntity> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            if (userService.checkPassword(user, oldPassword)) {
                userService.updatePassword(user, newPassword);
                return ResponseEntity.ok("Password changed successfully");
            }
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }
        return ResponseEntity.status(404).body("User not found");
    }
}