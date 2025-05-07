package com.game.bejeweled.service;

import com.game.bejeweled.entity.Comment;
import java.util.List;

public interface CommentService {
    void addComment(Comment comment);
    List<Comment> getComments(String game);
    void resetComments(String game);
}
