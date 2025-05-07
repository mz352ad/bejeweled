package com.game.bejeweled.server.controller;

import com.game.bejeweled.Board;
import com.game.bejeweled.Gem;
import com.game.bejeweled.entity.Comment;
import com.game.bejeweled.entity.Rating;
import com.game.bejeweled.entity.Score;
import com.game.bejeweled.service.CommentService;
import com.game.bejeweled.service.RatingService;
import com.game.bejeweled.service.ScoreService;
import org.springframework.context.annotation.Scope;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Scope("session")
public class BejeweledController {

    private final Board board;
    private final ScoreService scoreService;
    private final CommentService commentService;
    private final RatingService ratingService;

    public BejeweledController(ScoreService scoreService, CommentService commentService, RatingService ratingService) {
        this.board = new Board(6, 6);
        this.scoreService = scoreService;
        this.commentService = commentService;
        this.ratingService = ratingService;
    }

    @GetMapping("/bejeweled")
    public String bejeweled(HttpSession session, Model model) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            username = "Guest";
            session.setAttribute("user", username);
        }

        model.addAttribute("username", username);
        model.addAttribute("board", board);
        model.addAttribute("score", board.getScore());
        model.addAttribute("message", "Add your review please");

        return "game-page";
    }

    @GetMapping("/leaderboards")
    public String leaderboards(HttpSession session, Model model) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            username = "Guest";
        }

        model.addAttribute("username", username);
        model.addAttribute("topScores", scoreService.getTopScores("bejeweled"));
        model.addAttribute("activePage", "leaderboard");
        return "leaderboards";
    }

    @GetMapping("/reviews")
    public String reviews(HttpSession session, Model model) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            username = "Guest";
        }

        List<Comment> comments = commentService.getComments("bejeweled");

        model.addAttribute("username", username);
        model.addAttribute("comments", comments);
        model.addAttribute("averageRating", ratingService.getAverageRating("bejeweled"));
        model.addAttribute("activePage", "reviews");
        return "reviews";
    }

    @PostMapping("/bejeweled/swap")
    @ResponseBody
    public ResponseEntity<?> swapGemsAjax(@RequestParam int x1, @RequestParam int y1,
                                          @RequestParam int x2, @RequestParam int y2,
                                          HttpSession session) {

        boolean moved = board.swapGems(x1, y1, x2, y2);

        Map<String, Object> response = new HashMap<>();
        response.put("moved", moved);
        response.put("score", board.getScore());

        if (moved) {
            response.put("board", boardToMatrix());

            boolean hasPossibleMoves = board.hasPossibleMoves();
            response.put("hasPossibleMoves", hasPossibleMoves);

            if (!hasPossibleMoves) {
                String username = (String) session.getAttribute("user");
                if (username == null) {
                    username = "Guest";
                }

                Score score = new Score(username, "bejeweled", board.getScore(), LocalDateTime.now());
                scoreService.addScore(score);

                response.put("message", "Попередній результат збережено та додано до лідерборду. Почніть гру заново.");
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/bejeweled/restart")
    @ResponseBody
    public ResponseEntity<?> restartGame() {
        board.resetBoard();

        Map<String, Object> response = new HashMap<>();
        response.put("board", boardToMatrix());
        response.put("score", 0);
        response.put("success", true);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/bejeweled/review")
    public String addReview(@RequestParam String comment, @RequestParam int rating, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            username = "Guest";
        }

        Comment newComment = new Comment(username, "bejeweled", comment, LocalDateTime.now());
        commentService.addComment(newComment);

        if (rating >= 1 && rating <= 5) {
            Rating newRating = new Rating(username, "bejeweled", rating, LocalDateTime.now());
            ratingService.setRating(newRating);
        }

        return "redirect:/reviews";
    }

    private String[][] boardToMatrix() {
        String[][] matrix = new String[board.getHeight()][board.getWidth()];
        for (int y = 0; y < board.getHeight(); y++) {
            for (int x = 0; x < board.getWidth(); x++) {
                Gem gem = board.getGem(y, x);
                matrix[y][x] = gem != null ? gem.getType().name().toLowerCase() : "empty";
            }
        }
        return matrix;
    }

    @GetMapping("/main-page")
    public String landingPage(HttpSession session, Model model) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            username = "Guest";
        }
        model.addAttribute("username", username);
        model.addAttribute("activePage", "home");
        return "main-page";
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/main-page";
    }

    @PostMapping("/guest")
    public String playAsGuest(HttpSession session) {
        session.setAttribute("user", "Guest");
        return "redirect:/bejeweled";
    }
}