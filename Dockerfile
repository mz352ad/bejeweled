FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/Bejeweled-1.0-SNAPSHOT.jar app.jar

# Встановлюємо значення середовища за замовчуванням
ENV PGHOST=postgres.railway.internal
ENV PGPORT=5432
ENV PGDATABASE=railway
ENV PGUSER=postgres
ENV PGPASSWORD=oqYLjlarPnMQMgesBXVVzfcKdgcKVfQv
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Виводимо значення для дебагу при побудові
RUN echo "PGHOST: $PGHOST"
RUN echo "PGPORT: $PGPORT"
RUN echo "PGDATABASE: $PGDATABASE"
RUN echo "PGUSER: $PGUSER"
RUN echo "PORT: $PORT"
RUN echo "SPRING_PROFILES_ACTIVE: $SPRING_PROFILES_ACTIVE"

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]