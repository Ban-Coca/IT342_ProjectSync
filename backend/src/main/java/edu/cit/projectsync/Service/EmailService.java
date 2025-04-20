package edu.cit.projectsync.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.Recipient;
import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.exceptions.MailerSendException;

@Service
public class EmailService {

    @Autowired
    private Environment env;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        Email email = new Email();

        // Get values from environment that were loaded from your .env
        String apiToken = env.getProperty("MAILERSEND_API_TOKEN");
        String templateId = env.getProperty("MAILERSEND_TEMPLATE_VERIFICATION", "zr6ke4n8rym4on12");

        email.setFrom("ProjectSync", "info@domain.com");

        Recipient recipient = new Recipient(toEmail, toEmail);
        email.addRecipient(toEmail, toEmail);

        email.setTemplateId(templateId);

        email.addPersonalization(recipient, "user_code", verificationCode);
        email.addPersonalization(recipient, "user_email", toEmail);

        MailerSend ms = new MailerSend();
        ms.setToken(apiToken);

        try {
            MailerSendResponse response = ms.emails().send(email);
            System.out.println("Email sent successfully. Message ID: " + response.messageId);
        } catch (MailerSendException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
