package com.game.bejeweled.client;

import com.game.bejeweled.entity.Score;
import com.game.bejeweled.service.ScoreService;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

public class ScoreServiceRestClient implements ScoreService {

    private final RestTemplate restTemplate;
    private static final String URL = "http://localhost:8080/api/score";

    public ScoreServiceRestClient() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public void addScore(Score score) {
        restTemplate.postForEntity(URL, score, Void.class);
    }

    @Override
    public List<Score> getTopScores(String game) {
        Score[] scores = restTemplate.getForObject(URL + "/" + game, Score[].class);
        return scores != null ? Arrays.asList(scores) : List.of();
    }

    @Override
    public void resetScores(String game) {
        restTemplate.delete(URL + "/" + game);
    }
}
