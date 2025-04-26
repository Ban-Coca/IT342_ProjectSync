package edu.cit.projectsync.Service;

import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Entity.UserEntity;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
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
import java.util.List;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private TemplateEngine templateEngine;

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


    private String formatDate(LocalDate date) {
        if (date == null) {
            return "No due date";
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        return date.format(formatter);
    }

}
