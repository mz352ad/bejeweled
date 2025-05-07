package com.game.bejeweled.client;

import com.game.bejeweled.entity.Rating;
import com.game.bejeweled.service.RatingService;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

public class RatingServiceRestClient implements RatingService {

    private final RestTemplate restTemplate;
    private static final String URL = "http://localhost:8080/api/rating";

    public RatingServiceRestClient() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public void setRating(Rating rating) {
        restTemplate.postForEntity(URL, rating, Void.class);
    }

    @Override
    public int getAverageRating(String game) {
        Integer averageRating = restTemplate.getForObject(URL + "/" + game + "/average", Integer.class);
        return averageRating != null ? averageRating : 0;
    }

    @Override
    public int getRating(String game, String player) {
        Integer playerRating = restTemplate.getForObject(URL + "/" + game + "/" + player, Integer.class);
        return playerRating != null ? playerRating : 0;
    }

    @Override
    public void resetRatings(String game) {
        restTemplate.delete(URL + "/" + game);
    }

    @Override
    public List<Rating> getRatings(String game) {
        Rating[] ratings = restTemplate.getForObject(URL + "/" + game + "/all", Rating[].class);
        return ratings != null ? Arrays.asList(ratings) : List.of();
    }
}