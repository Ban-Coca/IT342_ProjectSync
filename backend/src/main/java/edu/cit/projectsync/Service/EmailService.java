package edu.cit.projectsync.Service;

import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private UserRepository userRepository;
    public void sendVerificationEmail(String toEmail, String firstName, String verificationCode) throws MessagingException {
        Context context = new Context();
        context .setVariable("firstName", firstName);
        context.setVariable("verificationCode", verificationCode);

        String htmlContent = templateEngine.process("password-reset", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject("Email Verification Code");
        helper.setText(htmlContent, true); // true indicates that the text is HTML
        mailSender.send(message);
    }

    @Async
    public void sendTaskAssignmentNotification(TaskEntity task) {
        try {
            // Get assigned users
            List<UserEntity> assignedUsers = task.getAssignedTo();
            if (assignedUsers == null || assignedUsers.isEmpty()) {
                // No users assigned, nothing to do
                return;
            }

            // Get creator information
            String assignedBy = "System"; // Default value

            // Send email to each assigned user
            for (UserEntity user : assignedUsers) {
                if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                    Context context = new Context();
                    context.setVariable("userName", user.getFirstName());
                    context.setVariable("task", task);
                    context.setVariable("projectName", task.getProject().getName());
                    context.setVariable("assignedBy", assignedBy);
                    context.setVariable("formattedDueDate", formatDate(task.getDueDate()));

                    // Process the template
                    String htmlContent = templateEngine.process("task-assignment", context);

                    // Create email message
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                    helper.setTo(user.getEmail());
                    helper.setSubject("New Task Assigned - ProjectSync");
                    helper.setText(htmlContent, true);

                    // Send the email
                    mailSender.send(message);
                }
            }
        } catch (Exception e) {
            // Log error
            e.printStackTrace();
        }
    }

    @Async
    public void sendProjectAdditionEmail(ProjectEntity project) {
        log.debug("Starting project addition email process for project ID: {}", project.getProjectId());

        try {
            List<UserEntity> teamMemberIds = project.getTeamMembers();
            if (teamMemberIds == null || teamMemberIds.isEmpty()) {
                log.debug("No team members found for project ID: {}", project.getProjectId());
                return;
            }

            log.debug("Found {} team members for project", teamMemberIds.size());
            String addedBy = project.getOwner() != null ? project.getOwner().getFirstName() : "Admin";

            // For each team member ID, fetch the complete user details
            for (UserEntity teamMemberId : teamMemberIds) {
                // Fetch complete user details from the repository
                UserEntity userEntity = userRepository.findById(teamMemberId.getUserId())
                        .orElse(null);

                if (userEntity == null) {
                    log.warn("Could not find user details for ID: {}", teamMemberId.getUserId());
                    continue;
                }

                String email = userEntity.getEmail();
                log.debug("Processing email for user ID: {}, email: {}", userEntity.getUserId(), email);

                if (email != null && !email.isEmpty()) {
                    Context context = new Context();

                    // Basic user info
                    context.setVariable("userName", userEntity.getFirstName());
                    context.setVariable("userLastName", userEntity.getLastName());

                    // Project info
                    context.setVariable("project", project);
                    context.setVariable("addedBy", addedBy);

                    // Format dates for display
                    context.setVariable("formattedStartDate", formatDate(project.getStartDate()));
                    context.setVariable("formattedDueDate", formatDate(project.getEndDate()));

                    // Get complete user information for all team members
                    List<UserEntity> completeTeamMembers = new ArrayList<>();
                    for (UserEntity memberId : teamMemberIds) {
                        UserEntity member = userRepository.findById(memberId.getUserId()).orElse(null);
                        if (member != null && !member.getUserId().equals(userEntity.getUserId())) {
                            completeTeamMembers.add(member);
                        }
                    }

                    context.setVariable("filteredTeamMembers", completeTeamMembers);
                    context.setVariable("showCurrentUser", Boolean.TRUE);

                    // Process the template
                    String htmlContent = templateEngine.process("project-addition", context);

                    // Create email message
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                    helper.setTo(email);
                    helper.setSubject("You've Been Added to a Project - ProjectSync");
                    helper.setText(htmlContent, true);

                    log.debug("Sending email to: {}", email);
                    mailSender.send(message);
                    log.info("Project addition email sent to: {}", email);
                } else {
                    log.warn("User ID: {} has no email address", userEntity.getUserId());
                }
            }
        } catch (Exception e) {
            log.error("Failed to send project addition email for project ID: {}",
                    project.getProjectId(), e);
        }
    }

//    private String generateProjectUrl(Long projectId) {
//        return baseUrl + "/projects/" + projectId;
//    }

    private String formatDate(LocalDate date) {
        if (date == null) {
            return "No due date";
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        return date.format(formatter);
    }

}
