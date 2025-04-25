package edu.cit.projectsync.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // Match all paths, not just /api/**
                        .allowedOriginPatterns("*")  // Allow all origins
                        .allowedMethods("*")  // Allow all methods
                        .allowedHeaders("*")  // Allow all headers
                        .exposedHeaders("*")  // Expose all headers
                        .allowCredentials(true)
                        .maxAge(3600L);  // Cache preflight for 1 hour
            }
        };
    }
}