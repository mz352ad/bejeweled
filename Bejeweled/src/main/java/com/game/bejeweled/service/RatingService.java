package com.game.bejeweled.service;

import com.game.bejeweled.entity.Rating;
import java.util.List;

public interface RatingService {
    void setRating(Rating rating);
    int getAverageRating(String game);
    int getRating(String game, String player);
    void resetRatings(String game);
    List<Rating> getRatings(String game);  // Новий метод
}