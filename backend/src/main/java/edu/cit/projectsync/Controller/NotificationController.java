package edu.cit.projectsync.Controller;

import edu.cit.projectsync.DTO.NotificationResponse;
import edu.cit.projectsync.Entity.NotificationEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.NotificationService;
import edu.cit.projectsync.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<NotificationResponse> getUserNotifications(
            @PathVariable (required = false) UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UserEntity currentUser = userService.findById(userId);
        log.debug("Getting user notifications with username: {}", currentUser);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NotificationEntity> notifications = notificationService.getUserNotifications(currentUser, pageRequest);

        return ResponseEntity.ok(NotificationResponse.fromPage(notifications));
    }

    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable (required = false) UUID userId) {
        UserEntity currentUser = userService.findById(userId);
        long count = notificationService.getUnreadCount(currentUser);

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(@PathVariable (required = false) UUID userId) {
        UserEntity currentUser = userService.findById(userId);
        List<NotificationEntity> notifications = notificationService.getUnreadNotifications(currentUser);

        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all/{userId}")
    public ResponseEntity<Map<String, Integer>> markAllAsRead(@PathVariable (required = false) UUID userId) {
        UserEntity currentUser = userService.findById(userId);
        int updatedCount = notificationService.markAllAsRead(currentUser);

        Map<String, Integer> response = new HashMap<>();
        response.put("markedAsRead", updatedCount);

        return ResponseEntity.ok(response);
    }
}