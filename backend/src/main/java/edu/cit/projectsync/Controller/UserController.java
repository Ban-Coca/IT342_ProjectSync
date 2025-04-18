package edu.cit.projectsync.Controller;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import edu.cit.projectsync.Entity.VerificationCodeEntity;
import edu.cit.projectsync.Service.EmailService;
import edu.cit.projectsync.Service.VerificationCodeService;
import edu.cit.projectsync.util.VerificationCodeGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
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

import edu.cit.projectsync.DTO.UserDTO;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Mapper.UserMapper;
import edu.cit.projectsync.Service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletResponse;



@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userv;

    @Autowired
    private VerificationCodeService codeService;

    @Autowired
    private EmailService emailService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${google.redirect-uri}")
    private String googleRedirectUri;
    
     @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @Value("${GOOGLE_CLIENT_SECRET}")
    private String googleClientSecret;

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

    @GetMapping("/oauth2/authorize/google")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth"
            + "?client_id=" + googleClientId
            + "&redirect_uri=" + googleRedirectUri
            + "&response_type=code"
            + "&scope=openid%20email%20profile";
        response.sendRedirect(googleAuthUrl);
    }

    @GetMapping("/oauth2/success")
    public void oauth2LoginSuccess(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) {
        try {
            logger.info("OAuth2 login successful for user: {}", (String) principal.getAttribute("email"));
    
            // Extract user details from OAuth2User
            String email = principal.getAttribute("email");
            String firstName = principal.getAttribute("given_name");
            String lastName = principal.getAttribute("family_name");
    
            if (email == null || firstName == null || lastName == null) {
                logger.error("Missing required attributes from OAuth2 provider");
                response.sendRedirect("http://localhost:5173/login-failure?error=InvalidOAuth2Response");
                return;
            }
    
            // Check if the user exists in the database
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                // Create a new user if not found
                user = new UserEntity();
                user.setEmail(email);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setProvider("google");
                user.setCreatedAt(new Date());
                user.setLastLogin(new Date());
                user.setIsActive(true);
    
                // Save the new user
                userv.postUserRecord(user);
            } else {
                // Update last login time for existing user
                user.setLastLogin(new Date());
                userv.postUserRecord(user);
            }
    
            // Generate JWT token
            String token = generateToken(user);
    
            // Redirect to the frontend with token and user details
            String frontendRedirectUrl = "http://localhost:5173/oauth2/callback";
            response.sendRedirect(frontendRedirectUrl + "?token=" + token + "&user=" + serializeUser(user));
    
        } catch (Exception e) {
            logger.error("Error during OAuth2 login: ", e);
            try {
                response.sendRedirect("http://localhost:5173/login-failure?error=OAuth2LoginFailed");
            } catch (IOException ioException) {
                logger.error("Error redirecting to frontend: ", ioException);
            }
        }
    }

    // Helper method to serialize UserEntity to a JSON string
    private String serializeUser(UserEntity user) {
        return String.format(
            "{\"userId\":%d,\"email\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"isActive\":%b,\"createdAt\":\"%s\",\"lastLogin\":\"%s\"}",
            user.getUserId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.IsActive(),
            user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
            user.getLastLogin() != null ? user.getLastLogin().toString() : null
        );
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
    
            // Check if the email already exists
            UserEntity existingUser = userv.findByEmail(user.getEmail());
            if (existingUser != null) {
                return ResponseEntity.badRequest().body("A user with this email already exists");
            }
    
            // Encrypt the password
            String encryptedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encryptedPassword);
    
            // Set default values for other fields
            user.setCreatedAt(new Date());
            user.setLastLogin(new Date());
            user.setIsActive(true);
    
            // Save the user
            UserEntity savedUser = userv.postUserRecord(user);
            UserDTO userDTO = UserMapper.toDTO(savedUser);
    
            // Generate a JWT token for the user
            String token = generateToken(savedUser);
    
            // Include the token in the response
            Map<String, Object> response = new HashMap<>();
            response.put("user", userDTO);
            response.put("token", token);
    
            return ResponseEntity.status(201).body(response);
    
        } catch (IllegalStateException e) {
            logger.error("Error creating user: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating user: ", e);
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }
    
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserEntity updatedUserDetails, @RequestParam("userId") UUID userId) {
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
            UserDTO userDTO = UserMapper.toDTO(updatedUser);
            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            logger.error("Error updating profile: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Profile update failed: " + e.getMessage()));
        }
    }

    @GetMapping("/getallusers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserEntity> users = userv.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                                      .map(UserMapper::toDTO)
                                      .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @DeleteMapping("/deleteuserdetails/{userId}")
    public String deleteUser(@PathVariable UUID userId) {
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            logger.info("Login attempt for email: {}", email);

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                logger.warn("No user found with email: {}", email);
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid email or password"));
            }

            // Check password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                logger.warn("Invalid password for email: {}", email);
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid email or password"));
            }

            // Generate JWT token
            String token = generateToken(user);
            logger.info("Successfully generated token for user: {}", email);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", getUserResponseMap(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                // For security reasons, don't reveal if email exists or not
                return ResponseEntity.ok(Map.of("message", "If your email exists in our system, you will receive a reset code"));
            }

            // Generate a random 6-digit verification code
            String verificationCode = VerificationCodeGenerator.generateVerificationCode();

            // Save the verification code
            codeService.createVerificationCode(user, verificationCode);

            // Send email with verification code
            emailService.sendVerificationEmail(email, verificationCode);

            return ResponseEntity.ok(Map.of("message", "If your email exists in our system, you will receive a reset code"));

        } catch (Exception e) {
            logger.error("Error in password reset request: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Error processing request: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and verification code are required"));
            }

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Invalid or expired verification code"));
            }

            // Find verification code for user
            Optional<VerificationCodeEntity> verificationCodeOpt = codeService.findByUser(user);

            if (verificationCodeOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Invalid or expired verification code"));
            }

            VerificationCodeEntity verificationCode = verificationCodeOpt.get();

            // Check if code matches and is not expired
            if (!verificationCode.getCode().equals(code) || !codeService.isCodeValid(verificationCode)) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired verification code"));
            }

            // Generate a temporary token for secure password reset
            String resetToken = UUID.randomUUID().toString();
            // Store the reset token (you might want to add this field to your VerificationCode entity)
            verificationCode.setResetToken(resetToken);
            codeService.save(verificationCode);

            return ResponseEntity.ok(Map.of(
                    "message", "Verification successful",
                    "resetToken", resetToken
            ));

        } catch (Exception e) {
            logger.error("Error in code verification: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Error verifying code: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String resetToken = request.get("resetToken");
            String newPassword = request.get("newPassword");

            logger.info("Password reset execution for email: {}", email);

            if (email == null || email.isEmpty() || resetToken == null || resetToken.isEmpty() ||
                    newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email, reset token, and new password are required"));
            }

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Invalid request"));
            }

            // Verify reset token
            Optional<VerificationCodeEntity> verificationCodeOpt = codeService.findByUser(user);

            if (verificationCodeOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Invalid request"));
            }

            VerificationCodeEntity verificationCode = verificationCodeOpt.get();

            // Check if token matches and is not expired
            if (!verificationCode.getResetToken().equals(resetToken) || !codeService.isCodeValid(verificationCode)) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired reset token"));
            }

            // Encrypt and update password
            String encryptedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encryptedPassword);

            userv.postUserRecord(user);

            // Delete the verification code record to prevent reuse
            codeService.deleteByUser(user);

            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (Exception e) {
            logger.error("Error in password reset: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Error in password reset: " + e.getMessage()));
        }
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

    @GetMapping("/findbyid/{userId}")
    public ResponseEntity<?> findById(@PathVariable UUID userId) {
        try {
            logger.info("Fetching user details for userId: {}", userId);

            // Fetch user by ID
            UserEntity user = userv.findById(userId);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            // Convert to DTO and return response
            UserDTO userDTO = UserMapper.toDTO(user);
            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            logger.error("Error fetching user by ID: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user: " + e.getMessage()));
        }
    }
}