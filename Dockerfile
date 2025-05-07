# Етап 1: збірка
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Етап 2: запуск
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/Bejeweled-1.0-SNAPSHOT.jar app.jar

# Встановлюємо значення середовища за замовчуванням
ENV PGHOST=containers-us-west-1.railway.app
ENV PGPORT=5432
ENV PGDATABASE=railway
ENV PGUSER=postgres
ENV PGPASSWORD=1844
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]