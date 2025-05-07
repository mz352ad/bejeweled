FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/Bejeweled-1.0-SNAPSHOT.jar app.jar

# Add these environment variables (replace with actual values)
ENV PGHOST=your-postgres-host
ENV PGPORT=5432
ENV PGDATABASE=your-database-name
ENV PGUSER=your-username
ENV PGPASSWORD=your-password

ENTRYPOINT ["java", "-jar", "app.jar"]