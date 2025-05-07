FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/Bejeweled-1.0-SNAPSHOT.jar app.jar

# Використовуємо формат DATABASE_URL
ENV DATABASE_URL=postgresql://postgres:oqYLjlarPnWOMgesBXVVzfcKdgcKVfQv@hopper.proxy.rlwy.net:55758/railway
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-Dspring.datasource.url=jdbc:postgresql://postgres:oqYLjlarPnWOMgesBXVVzfcKdgcKVfQv@hopper.proxy.rlwy.net:55758/railway", "-jar", "app.jar"]