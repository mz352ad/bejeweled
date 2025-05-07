package com.game.bejeweled.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@NamedQueries({
        @NamedQuery(name = "Rating.getAverageRating", query = "SELECT AVG(r.rating) FROM Rating r WHERE r.game = :game"),
        @NamedQuery(name = "Rating.resetRatings", query = "DELETE FROM Rating r WHERE r.game = :game")
})
public class Rating implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String player;
    private String game;
    private int rating;

    private LocalDateTime ratedOn;

    public Rating() {
    }

    public Rating(String player, String game, int rating, LocalDateTime ratedOn) {
        this.player = player;
        this.game = game;
        this.rating = rating;
        this.ratedOn = ratedOn;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }

    public String getGame() {
        return game;
    }

    public void setGame(String game) {
        this.game = game;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public LocalDateTime getRatedOn() {
        return ratedOn;
    }

    public void setRatedOn(LocalDateTime ratedOn) {
        this.ratedOn = ratedOn;
    }
}
