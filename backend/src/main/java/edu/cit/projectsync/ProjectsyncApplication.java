package edu.cit.projectsync;

import java.util.Objects;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ProjectsyncApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
        System.setProperty("DB_URL", Objects.requireNonNull(dotenv.get("DB_URL")));
        System.setProperty("DB_USERNAME", Objects.requireNonNull(dotenv.get("DB_USERNAME")));
        System.setProperty("DB_PASSWORD", Objects.requireNonNull(dotenv.get("DB_PASSWORD")));
		System.setProperty("GOOGLE_CLIENT_ID", Objects.requireNonNull(dotenv.get("GOOGLE_CLIENT_ID")));
        System.setProperty("GOOGLE_CLIENT_SECRET", Objects.requireNonNull(dotenv.get("GOOGLE_CLIENT_SECRET")));
        System.setProperty("JWT_SECRET", Objects.requireNonNull(dotenv.get("JWT_SECRET")));
        System.setProperty("JWT_EXPIRATION", Objects.requireNonNull(dotenv.get("JWT_EXPIRATION")));
        System.setProperty("google.redirect-uri", Objects.requireNonNull(dotenv.get("GOOGLE_REDIRECT_URI")));
        System.setProperty("EMAIL_HOST", Objects.requireNonNull(dotenv.get("EMAIL_HOST")));
        System.setProperty("EMAIL_PORT", Objects.requireNonNull(dotenv.get("EMAIL_PORT")));
        System.setProperty("EMAIL_USERNAME", Objects.requireNonNull(dotenv.get("EMAIL_USERNAME")));
        System.setProperty("EMAIL_PASSWORD", Objects.requireNonNull(dotenv.get("EMAIL_PASSWORD")));
        System.setProperty("BACKBLAZE_APPLICATION_KEY_ID", Objects.requireNonNull(dotenv.get("BACKBLAZE_APPLICATION_KEY_ID")));
        System.setProperty("BACKBLAZE_APPLICATION_KEY", Objects.requireNonNull(dotenv.get("BACKBLAZE_APPLICATION_KEY")));
        System.setProperty("BACKBLAZE_BUCKET_ID", Objects.requireNonNull(dotenv.get("BACKBLAZE_BUCKET_ID")));
        System.setProperty("BACKBLAZE_BUCKET_NAME", Objects.requireNonNull(dotenv.get("BACKBLAZE_BUCKET_NAME")));
		SpringApplication.run(ProjectsyncApplication.class, args);
	}

}
