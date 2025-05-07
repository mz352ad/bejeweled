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
        // Set a system property to indicate we're running in server mode
        System.setProperty("app.mode", "server");
        SpringApplication.run(GameStudioServer.class, args);
    }
}