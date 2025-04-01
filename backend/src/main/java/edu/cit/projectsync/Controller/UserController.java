package edu.cit.projectsync.Controller;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;



@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userv;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/print")
    public String print() {
        return "Hello, User";
    }

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("API is running on port 8080.");
    }

    @PostMapping("/postuserrecord")
    public ResponseEntity<?> postUserRecord(@RequestBody UserEntity user) {
        try {
            logger.info("Received registration request for email: {}", user.getEmail());

            // Validate required fields
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            // Encrypt the password
            String encryptedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encryptedPassword);

            // Set default values for other fields
            user.setCreatedAt(new Date());
            user.setLastLogin(new Date());
            user.setIsActive(true);

            UserEntity savedUser = userv.postUserRecord(user);

            // Generate a JWT token for the user
            String token = generateToken(savedUser);

            // Don't send the encrypted password back in the response
            savedUser.setPassword(null);

            // Include the token in the response
            Map<String, Object> response = new HashMap<>();
            response.put("user", savedUser);
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error creating user: ", e);
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserEntity updatedUserDetails, @RequestParam("userId") int userId) {
        try {
            logger.info("Received profile update request for user: {}", userId);

            // Validate user
            UserEntity user = userv.findById(userId);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            // Update user details
            user.setFirstName(updatedUserDetails.getFirstName());
            user.setLastName(updatedUserDetails.getLastName());
            user.setIsActive(updatedUserDetails.IsActive());

            // Save updated user
            UserEntity updatedUser = userv.postUserRecord(user);

            return ResponseEntity.ok(getUserResponseMap(updatedUser));

        } catch (Exception e) {
            logger.error("Error updating profile: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Profile update failed: " + e.getMessage()));
        }
    }

    @GetMapping("/getallusers")
    public List<UserEntity> getAllUsers() {
        return userv.getAllUsers();
    }

    @DeleteMapping("/deleteuserdetails/{userId}")
    public String deleteUser(@PathVariable int userId) {
        return userv.deleteUser(userId);
    }

    private Map<String, Object> getUserResponseMap(UserEntity user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("userId", user.getUserId());
        userMap.put("email", user.getEmail());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("isActive", user.IsActive());
        userMap.put("createdAt", user.getCreatedAt());
        userMap.put("lastLogin", user.getLastLogin());
        userMap.put("updatedAt", user.getUpdatedAt());
        userMap.put("provider", user.getProvider());

        return userMap;
    }

    private String generateToken(UserEntity user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getUserId()))
                .claim("email", user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }
}