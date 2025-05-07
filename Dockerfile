FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/Bejeweled-1.0-SNAPSHOT.jar app.jar

# Явно встановлюємо змінні середовища
ENV PGHOST=postgres.railway.internal
ENV PGPORT=5432
ENV PGDATABASE=railway
ENV PGUSER=postgres
ENV PGPASSWORD=oqYLjlarPnMQMgesBXVVzfcKdgcKVfQv
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Явно вказуємо URL для Spring DataSource
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres.railway.internal:5432/railway
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=oqYLjlarPnMQMgesBXVVzfcKdgcKVfQv

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]