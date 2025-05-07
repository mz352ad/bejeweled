package com.game.bejeweled.server.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String pgHost = System.getenv("PGHOST");
        String pgPort = System.getenv("PGPORT");
        String pgDatabase = System.getenv("PGDATABASE");
        String pgUser = System.getenv("PGUSER");
        String pgPassword = System.getenv("PGPASSWORD");

        System.out.println("PGHOST: " + pgHost);
        System.out.println("PGPORT: " + pgPort);
        System.out.println("PGDATABASE: " + pgDatabase);
        System.out.println("PGUSER: " + pgUser);

        // Перевірка на null та встановлення значень за замовчуванням
        if (pgHost == null) pgHost = "containers-us-west-1.railway.app";
        if (pgPort == null) pgPort = "5432";
        if (pgDatabase == null) pgDatabase = "railway";
        if (pgUser == null) pgUser = "postgres";
        if (pgPassword == null) pgPassword = "1844";

        String url = "jdbc:postgresql://" + pgHost + ":" + pgPort + "/" + pgDatabase;
        System.out.println("Database URL: " + url);

        return DataSourceBuilder
                .create()
                .url(url)
                .username(pgUser)
                .password(pgPassword)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}