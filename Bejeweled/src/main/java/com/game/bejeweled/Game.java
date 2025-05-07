package com.game.bejeweled;

import com.game.bejeweled.entity.Comment;
import com.game.bejeweled.entity.Rating;
import com.game.bejeweled.entity.Score;
import com.game.bejeweled.service.CommentService;
import com.game.bejeweled.service.RatingService;
import com.game.bejeweled.service.ScoreService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Scanner;

public class Game {
    private final Scanner scanner = new Scanner(System.in);
    private final UI ui;
    private final Board board;
    private final ScoreService scoreService;
    private final CommentService commentService;
    private final RatingService ratingService;
    private String playerName;

    public Game(ScoreService scoreService, CommentService commentService, RatingService ratingService) {
        this.board = new Board(8, 8);
        this.ui = new UI();
        this.scoreService = scoreService;
        this.commentService = commentService;
        this.ratingService = ratingService;
    }

    public void start() {
        System.out.print("🎮 Enter your name: ");
        playerName = scanner.nextLine();

        System.out.println("\n🎉 Welcome, " + playerName + "!\n");

        while (true) {
            ui.printBoard(board);
            System.out.print("\nEnter move (e.g., A0B0) or X to exit: ");
            String input = scanner.nextLine().toUpperCase();

            if (input.equals("X")) {
                System.out.println("\n🎮 Game Over! Final Score: " + board.getScore());

                Score newScore = new Score(playerName, "bejeweled", board.getScore(), LocalDateTime.now());
                scoreService.addScore(newScore);

                System.out.println("\n🏆 TOP 10 PLAYERS:");
                List<Score> topScores = scoreService.getTopScores("bejeweled");
                for (int i = 0; i < topScores.size(); i++) {
                    Score score = topScores.get(i);
                    System.out.printf("%d. %s - %d%n", i + 1, score.getPlayer(), score.getPoints());
                }

                System.out.print("\n💬 Want to leave a comment? (y/n): ");
                String commentAnswer = scanner.nextLine();
                if (commentAnswer.equalsIgnoreCase("y")) {
                    System.out.print("✏️ Enter your comment: ");
                    String comment = scanner.nextLine();
                    commentService.addComment(new Comment("bejeweled", playerName, comment, LocalDateTime.now()));
                }

                System.out.print("\n⭐ Rate the game from 1 to 5: ");
                try {
                    int rating = Integer.parseInt(scanner.nextLine());
                    if (rating >= 1 && rating <= 5) {
                        ratingService.setRating(new Rating("bejeweled", playerName, rating, LocalDateTime.now()));
                    }
                } catch (NumberFormatException ignored) {
                    System.out.println("⚠️ Invalid rating input. Skipping...");
                }

                break;
            }

            board.processMove(input);
        }
    }
}
