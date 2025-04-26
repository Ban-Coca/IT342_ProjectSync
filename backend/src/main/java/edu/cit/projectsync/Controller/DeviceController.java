package edu.cit.projectsync.Controller;

import edu.cit.projectsync.DTO.DeviceRegistrationRequest;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/device")
public class DeviceController {

    private static final Logger log = LoggerFactory.getLogger(DeviceController.class);
    private final UserService userService; // Assuming you have a user service

    @Autowired
    public DeviceController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register-device")
    public ResponseEntity<String> registerDevice(@RequestBody DeviceRegistrationRequest request) {
        try {
            // Find user by the provided userId
            UserEntity user = userService.findById(request.getUserId());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Update the user's device token
            user.setDeviceToken(request.getToken());
            userService.postUserRecord(user);

            log.info("Registered device token for user: " + request.getUserId());
            return ResponseEntity.ok("Device registered successfully");
        } catch (Exception e) {
            log.error("Error registering device: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to register device: " + e.getMessage());
        }
    }
    @PostMapping("/revoke-device")
    public ResponseEntity<String> revokeDevice(@RequestBody DeviceRegistrationRequest request) {
        try {
            // Find user by the provided userId
            UserEntity user = userService.findById(request.getUserId());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Check if the token matches the user's current token
            if (request.getToken() != null && request.getToken().equals(user.getDeviceToken())) {
                // Clear the device token
                user.setDeviceToken(null);
                userService.postUserRecord(user);
                log.info("Revoked device token for user: " + request.getUserId());
                return ResponseEntity.ok("Device token revoked successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token mismatch or not provided");
            }
        } catch (Exception e) {
            log.error("Error revoking device token: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to revoke device token: " + e.getMessage());
        }
    }
}
