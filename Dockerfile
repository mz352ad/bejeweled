FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/Bejeweled-1.0-SNAPSHOT.jar app.jar

# Встановлюємо значення середовища за замовчуванням
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://hopper.proxy.rlwy.net:55758/railway
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=oqYLjlarPnWOMgesBXVVzfcKdgcKVfQv
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]