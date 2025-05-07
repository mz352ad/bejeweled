package com.game.bejeweled.server.webservice;

import com.game.bejeweled.entity.Comment;
import com.game.bejeweled.entity.Rating;
import com.game.bejeweled.entity.Score;
import com.game.bejeweled.service.CommentService;
import com.game.bejeweled.service.RatingService;
import com.game.bejeweled.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private ScoreService scoreService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private RatingService ratingService;

    @GetMapping("/leaderboard")
    public List<Score> getTopScores() {
        return scoreService.getTopScores("bejeweled");
    }

    @GetMapping("/reviews")
    public List<Comment> getComments() {
        return commentService.getComments("bejeweled");
    }

    @GetMapping("/ratings")
    public List<Rating> getRatings() {
        return ratingService.getRatings("bejeweled");
    }
}