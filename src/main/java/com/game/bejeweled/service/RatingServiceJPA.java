package com.game.bejeweled.service;

import com.game.bejeweled.entity.Rating;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RatingServiceJPA implements RatingService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void setRating(Rating rating) {
        // Перевіряємо чи рейтинг вже існує для цього гравця та гри
        Rating existing = entityManager.createQuery(
                        "SELECT r FROM Rating r WHERE r.game = :game AND r.player = :player", Rating.class)
                .setParameter("game", rating.getGame())
                .setParameter("player", rating.getPlayer())
                .getResultStream()
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setRating(rating.getRating());
            existing.setRatedOn(rating.getRatedOn());
            entityManager.merge(existing);
        } else {
            entityManager.persist(rating);
        }
    }

    @Override
    public int getAverageRating(String game) {
        Double average = entityManager.createQuery(
                        "SELECT AVG(r.rating) FROM Rating r WHERE r.game = :game", Double.class)
                .setParameter("game", game)
                .getSingleResult();

        return average != null ? (int) Math.round(average) : 0;
    }

    @Override
    public int getRating(String game, String player) {
        Integer rating = entityManager.createQuery(
                        "SELECT r.rating FROM Rating r WHERE r.game = :game AND r.player = :player", Integer.class)
                .setParameter("game", game)
                .setParameter("player", player)
                .getResultStream()
                .findFirst()
                .orElse(0);
        return rating;
    }

    @Override
    public void resetRatings(String game) {
        entityManager.createQuery("DELETE FROM Rating r WHERE r.game = :game")
                .setParameter("game", game)
                .executeUpdate();
    }

    @Override
    public List<Rating> getRatings(String game) {
        return entityManager.createQuery(
                        "SELECT r FROM Rating r WHERE r.game = :game ORDER BY r.ratedOn DESC",
                        Rating.class)
                .setParameter("game", game)
                .getResultList();
    }
}
