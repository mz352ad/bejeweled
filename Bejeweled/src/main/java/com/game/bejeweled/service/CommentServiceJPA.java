package com.game.bejeweled.service;

import com.game.bejeweled.entity.Comment;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class CommentServiceJPA implements CommentService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void addComment(Comment comment) {
        entityManager.persist(comment);
    }

    @Override
    public List<Comment> getComments(String game) {
        return entityManager.createQuery(
                        "SELECT c FROM Comment c WHERE c.game = :game ORDER BY c.commentedOn DESC",
                        Comment.class
                )
                .setParameter("game", game)
                .setMaxResults(3)
                .getResultList();
    }

    @Override
    public void resetComments(String game) {
        entityManager.createNamedQuery("Comment.resetComments")
                .setParameter("game", game)
                .executeUpdate();
    }
}
