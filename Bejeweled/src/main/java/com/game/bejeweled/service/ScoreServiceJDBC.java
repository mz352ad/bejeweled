package com.game.bejeweled.service;

import com.game.bejeweled.entity.Score;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ScoreServiceJDBC implements ScoreService {
    private static final String URL = "jdbc:postgresql://localhost:5432/gamestudio";
    private static final String USER = "postgres";
    private static final String PASSWORD = "1844";

    public ScoreServiceJDBC() {
        try {
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            conn.close();
        } catch (SQLException e) {
            throw new RuntimeException("Database connection error: " + e.getMessage(), e);
        }
    }

    @Override
    public void addScore(Score score) {
        String sql = "INSERT INTO score (player, game, points, played_on) VALUES (?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, score.getPlayer());
            stmt.setString(2, score.getGame());
            stmt.setInt(3, score.getPoints());
            stmt.setTimestamp(4, Timestamp.valueOf(score.getPlayedOn()));

            stmt.executeUpdate();
            System.out.println("✅ Score saved for player: " + score.getPlayer());

        } catch (SQLException e) {
            throw new RuntimeException("Database error: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Score> getTopScores(String game) {
        List<Score> scores = new ArrayList<>();
        String sql = "SELECT player, game, points, played_on FROM score WHERE game = ? ORDER BY points DESC LIMIT 10";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, game);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                scores.add(new Score(
                        rs.getString("player"),
                        rs.getString("game"),
                        rs.getInt("points"),
                        rs.getTimestamp("played_on").toLocalDateTime()
                ));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Database error: " + e.getMessage(), e);
        }
        return scores;
    }

    @Override
    public void resetScores(String game) {
        String sql = "DELETE FROM score WHERE game = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, game);
            stmt.executeUpdate();
            System.out.println("✅ Scores reset for game: " + game);

        } catch (SQLException e) {
            throw new RuntimeException("Database error: " + e.getMessage(), e);
        }
    }
}
