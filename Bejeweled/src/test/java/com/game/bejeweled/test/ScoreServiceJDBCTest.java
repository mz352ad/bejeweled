package com.game.bejeweled.test;

import com.game.bejeweled.entity.Score;
import com.game.bejeweled.service.ScoreServiceJDBC;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ScoreServiceJDBCTest {
    private static ScoreServiceJDBC scoreService;

    @BeforeAll
    static void setup() {
        scoreService = new ScoreServiceJDBC();
    }

    @BeforeEach
    void clearDatabase() {
        scoreService.resetScores("Bejeweled");
    }

    @Test
    void testAddScore() {
        Score score = new Score("Alice", "Bejeweled", 500, LocalDateTime.now());
        scoreService.addScore(score);

        List<Score> scores = scoreService.getTopScores("Bejeweled");
        assertFalse(scores.isEmpty(), "The score list should not be empty");
        assertEquals("Alice", scores.get(0).getPlayer());
        assertEquals(500, scores.get(0).getPoints());
    }

    @Test
    void testGetTopScores() {
        scoreService.addScore(new Score("Alice", "Bejeweled", 500, LocalDateTime.now()));
        scoreService.addScore(new Score("Bob", "Bejeweled", 600, LocalDateTime.now()));

        List<Score> scores = scoreService.getTopScores("Bejeweled");

        assertEquals(2, scores.size(), "There should be two scores in the database");
        assertEquals("Bob", scores.get(0).getPlayer(), "The player with the highest score should be first");
    }

    @Test
    void testResetScores() {
        scoreService.addScore(new Score("Alice", "Bejeweled", 500, LocalDateTime.now()));
        scoreService.resetScores("Bejeweled");

        List<Score> scores = scoreService.getTopScores("Bejeweled");
        assertTrue(scores.isEmpty(), "Scores should be cleared after reset");
    }
}
