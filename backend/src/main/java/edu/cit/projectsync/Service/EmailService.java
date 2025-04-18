package edu.cit.projectsync.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.mailtrap.client.MailtrapClient;
import io.mailtrap.config.MailtrapConfig;
import io.mailtrap.factory.MailtrapClientFactory;
import io.mailtrap.model.request.emails.Address;
import io.mailtrap.model.request.emails.MailtrapMail;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {
    @Value("${MAILTRAP_API_TOKEN}")
    private String TOKEN;
    @Value("${MATILTRAP_TEMPLATE_RESET_ID}")
    private String TEMPLATE_RESET_ID;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        final MailtrapConfig config = new MailtrapConfig.Builder()
                .sandbox(true)
                .inboxId(3589442L)
                .token(TOKEN)
                .build();

        final MailtrapClient client = MailtrapClientFactory.createMailtrapClient(config);

        final MailtrapMail mail = MailtrapMail.builder()
                .from(new Address("hello@demomailtrap.co", "Mailtrap Test"))
                .to(List.of(new Address("vanharvey.coca@cit.edu")))
                .templateUuid(TEMPLATE_RESET_ID)
                .templateVariables(Map.of(
                        "user_email", toEmail,
                        "user_code", verificationCode
                ))
                .build();

        try {
            System.out.println(client.send(mail));
        } catch (Exception e) {
            System.out.println("Caught exception : " + e);
        }
    }
}
