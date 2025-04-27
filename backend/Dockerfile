FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/projectsync-0.0.1-SNAPSHOT.jar app.jar

COPY .env /app/.env

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]