# Етап 1: збірка
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Етап 2: запуск
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/Bejeweled-1.0-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]