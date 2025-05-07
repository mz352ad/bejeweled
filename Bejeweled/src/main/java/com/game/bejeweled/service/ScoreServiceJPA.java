package com.game.bejeweled.service;

import com.game.bejeweled.entity.Score;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Service
@Primary
@Transactional
public class ScoreServiceJPA implements ScoreService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void addScore(Score score) {
        entityManager.persist(score);
    }

    @Override
    public List<Score> getTopScores(String game) {
        return entityManager.createQuery(
                        "SELECT s FROM Score s WHERE s.game = :game ORDER BY s.points DESC",
                        Score.class
                )
                .setParameter("game", game)
                .setMaxResults(10)
                .getResultList();
    }

    @Override
    public void resetScores(String game) {
        entityManager.createQuery("DELETE FROM Score s WHERE s.game = :game")
                .setParameter("game", game)
                .executeUpdate();
    }
}
