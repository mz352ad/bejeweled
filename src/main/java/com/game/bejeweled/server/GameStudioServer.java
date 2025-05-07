package com.game.bejeweled.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(
        basePackages = {
                "com.game.bejeweled.entity",
                "com.game.bejeweled.repository",
                "com.game.bejeweled.service",
                "com.game.bejeweled.server"
        },
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.REGEX,
                pattern = {"com.game.bejeweled.client.*", "com.game.bejeweled.Game"}
        )
)
@EntityScan("com.game.bejeweled.entity")
@EnableJpaRepositories("com.game.bejeweled.repository")
public class GameStudioServer {
    public static void main(String[] args) {
        // Виведемо змінні середовища для діагностики
        System.out.println("PGHOST: " + System.getenv("PGHOST"));
        System.out.println("PGPORT: " + System.getenv("PGPORT"));
        System.out.println("PGDATABASE: " + System.getenv("PGDATABASE"));
        System.out.println("PGUSER: " + System.getenv("PGUSER"));

        // Задаємо явні системні властивості, якщо змінні середовища існують
        if (System.getenv("PGHOST") != null) {
            System.setProperty("PGHOST", System.getenv("PGHOST"));
        }
        if (System.getenv("PGPORT") != null) {
            System.setProperty("PGPORT", System.getenv("PGPORT"));
        }
        if (System.getenv("PGDATABASE") != null) {
            System.setProperty("PGDATABASE", System.getenv("PGDATABASE"));
        }
        if (System.getenv("PGUSER") != null) {
            System.setProperty("PGUSER", System.getenv("PGUSER"));
        }
        if (System.getenv("PGPASSWORD") != null) {
            System.setProperty("PGPASSWORD", System.getenv("PGPASSWORD"));
        }

        // Встановіть режим сервера
        System.setProperty("app.mode", "server");
        SpringApplication.run(GameStudioServer.class, args);
    }
}