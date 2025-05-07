package com.game.bejeweled.server.webservice;

import com.game.bejeweled.entity.Rating;
import com.game.bejeweled.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rating")
public class RatingServiceRest {

    @Autowired
    private RatingService ratingService;

    @GetMapping("/{game}/average")
    public int getAverageRating(@PathVariable String game) {
        return ratingService.getAverageRating(game);
    }

    @GetMapping("/{game}/{player}")
    public int getPlayerRating(@PathVariable String game, @PathVariable String player) {
        return ratingService.getRating(game, player);
    }

    @GetMapping("/{game}/all")
    public List<Rating> getAllRatings(@PathVariable String game) {
        return ratingService.getRatings(game);
    }

    @PostMapping
    public void setRating(@RequestBody Rating rating) {
        ratingService.setRating(rating);
    }

    @DeleteMapping("/{game}")
    public void resetRating(@PathVariable String game) {
        ratingService.resetRatings(game);
    }
}