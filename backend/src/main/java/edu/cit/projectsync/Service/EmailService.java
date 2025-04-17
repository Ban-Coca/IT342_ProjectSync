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
                .token(TOKEN)
                .build();
        final MailtrapClient client = MailtrapClientFactory.createMailtrapClient(config);
        final MailtrapMail mail = MailtrapMail.builder()
                .from(new Address("hello@project-sync.xyz", "Reset Password"))
                .to(List.of(new Address(toEmail)))
                .templateUuid(TEMPLATE_RESET_ID)
                .templateVariables(Map.of(
                        "user_email", toEmail,
                        "user_code", verificationCode
                ))
                .build();

        System.out.println(client.sendingApi().emails().send(mail));
    }
}
