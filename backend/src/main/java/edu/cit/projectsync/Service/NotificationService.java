package edu.cit.projectsync.Service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import edu.cit.projectsync.Controller.DocumentController;
import edu.cit.projectsync.Entity.NotificationEntity;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import edu.cit.projectsync.Entity.UserEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final FirebaseApp firebaseApp;
    private final UserService userService; // You'll need a user service to fetch the device token

    @Autowired
    private NotificationRepository repository;

    public NotificationService(FirebaseApp firebaseApp, UserService userService) {
        this.firebaseApp = firebaseApp;
        this.userService = userService;
    }

    @Transactional
    public void sendTaskNotification(TaskEntity taskEntity) {
        try {
            if (taskEntity.getAssignedTo() == null) {
                log.info("No user assigned to task. Skipping notification.");
                return;
            }

            // Get the user entity to access their device token
            UserEntity assignedUser = userService.findById(taskEntity.getAssignedTo().getFirst().getUserId());

            if (assignedUser == null) {
                log.error("Assigned user not found in database");
                return;
            }

            String title = "New Task Assigned: " + taskEntity.getTitle();
            String body = taskEntity.getDescription() != null ?
                    taskEntity.getDescription() : "You've been assigned a new task.";

            // Save notification to database
            NotificationEntity notification = new NotificationEntity(
                    title,
                    body,
                    assignedUser,
                    "TASK_ASSIGNED",
                    taskEntity.getTaskId()
            );
            repository.save(notification);

            String deviceToken = assignedUser.getDeviceToken();

            if (deviceToken == null || deviceToken.isEmpty()) {
                log.info("User doesn't have a registered device token. Skipping notification.");
                return;
            }

            // Create notification message targeting specific device
            Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setToken(deviceToken) // Send to specific device token instead of topic
                    .build();

            log.info("Sending task notification to user ID: " + assignedUser.getUserId());

            // Send the message
            String response = FirebaseMessaging.getInstance(firebaseApp).send(message);
            log.info("Successfully sent notification: " + response);

        } catch (FirebaseMessagingException e) {
            log.error("Error sending task notification: " + e.getMessage(), e);
            // You might want to throw this exception to be caught by the calling method
        } catch (Exception e) {
            log.error("Unexpected error in notification service: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void sendProjectAdditionNotification(ProjectEntity project){
        try {
            if (project.getTeamMembers() == null || project.getTeamMembers().isEmpty()) {
                log.info("No users assigned to project. Skipping notification.");
                return;
            }

            String title = "New Project Added: " + project.getName();
            String body = "You've been added to a new project.";

            // Save notification to database
            for (UserEntity user : project.getTeamMembers()) {
                NotificationEntity notification = new NotificationEntity(
                        title,
                        body,
                        user,
                        "PROJECT_ADDED",
                        project.getProjectId()
                );
                repository.save(notification);

                String deviceToken = user.getDeviceToken();

                if (deviceToken == null || deviceToken.isEmpty()) {
                    log.info("User doesn't have a registered device token. Skipping notification.");
                    continue;
                }

                // Create notification message targeting specific device
                Message message = Message.builder()
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build())
                        .setToken(deviceToken) // Send to specific device token instead of topic
                        .build();

                log.info("Sending project addition notification to user ID: " + user.getUserId());

                // Send the message
                String response = FirebaseMessaging.getInstance(firebaseApp).send(message);
                log.info("Successfully sent notification: " + response);
            }
        } catch (FirebaseMessagingException e) {
            log.error("Error sending project addition notification: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error in notification service: " + e.getMessage(), e);
        }
    }

    public Page<NotificationEntity> getUserNotifications(UserEntity user, Pageable pageable) {
        return repository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    // Get user's unread notifications
    public List<NotificationEntity> getUnreadNotifications(UserEntity user) {
        return repository.findByUserAndReadFalseOrderByCreatedAtDesc(user);
    }

    // Get unread notification count
    public long getUnreadCount(UserEntity user) {
        return repository.countByUserAndReadFalse(user);
    }

    // Mark a notification as read
    @Transactional
    public void markAsRead(UUID notificationId) {
        repository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            repository.save(notification);
        });
    }

    // Mark all notifications as read for a user
    @Transactional
    public int markAllAsRead(UserEntity user) {
        return repository.markAllAsRead(user);
    }

    // Create a general notification (not related to tasks)
    @Transactional
    public NotificationEntity createNotification(String title, String message, UserEntity user,
                                                 String notificationType, UUID relatedEntityId) {
        NotificationEntity notification = new NotificationEntity(
                title, message, user, notificationType, relatedEntityId
        );
        return repository.save(notification);
    }
}
