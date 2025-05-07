package com.game.bejeweled.server.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = "jdbc:postgresql://containers-us-west-1.railway.app:5432/railway";
        String username = "postgres";
        String password = "1844";

        // Перевіримо з'єднання перед створенням пулу
        try {
            System.out.println("Тестуємо з'єднання з базою даних...");
            Properties props = new Properties();
            props.setProperty("user", username);
            props.setProperty("password", password);
            props.setProperty("connectTimeout", "10");
            props.setProperty("loginTimeout", "10");

            Connection conn = DriverManager.getConnection(url, props);
            System.out.println("З'єднання успішне!");
            conn.close();
        } catch (SQLException e) {
            System.err.println("Помилка з'єднання з базою даних: " + e.getMessage());
        }

        return DataSourceBuilder
                .create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}