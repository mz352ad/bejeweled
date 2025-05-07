package com.game.bejeweled.service;

import com.game.bejeweled.entity.Score;
import java.util.List;

public interface ScoreService {
    void addScore(Score score);
    List<Score> getTopScores(String game);
    void resetScores(String game);
}
