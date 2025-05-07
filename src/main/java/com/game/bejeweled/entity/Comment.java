package com.game.bejeweled.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@NamedQueries({
        @NamedQuery(name = "Comment.getComments", query = "SELECT c FROM Comment c WHERE c.game = :game ORDER BY c.commentedOn DESC"),
        @NamedQuery(name = "Comment.resetComments", query = "DELETE FROM Comment c WHERE c.game = :game")
})
public class Comment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String player;
    private String game;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime commentedOn;

    public Comment() {
    }

    public Comment(String player, String game, String comment, LocalDateTime commentedOn) {
        this.player = player;
        this.game = game;
        this.comment = comment;
        this.commentedOn = commentedOn;
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCommentedOn() {
        return commentedOn;
    }

    public void setCommentedOn(LocalDateTime commentedOn) {
        this.commentedOn = commentedOn;
    }
}
