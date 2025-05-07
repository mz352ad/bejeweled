package com.game.bejeweled.client;

import com.game.bejeweled.entity.Comment;
import com.game.bejeweled.service.CommentService;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

public class CommentServiceRestClient implements CommentService {

    private final RestTemplate restTemplate;
    private static final String URL = "http://localhost:8080/api/comment";

    public CommentServiceRestClient() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public void addComment(Comment comment) {
        restTemplate.postForEntity(URL, comment, Void.class);
    }

    @Override
    public List<Comment> getComments(String game) {
        Comment[] comments = restTemplate.getForObject(URL + "/" + game, Comment[].class);
        return comments != null ? Arrays.asList(comments) : List.of();
    }

    @Override
    public void resetComments(String game) {
        restTemplate.delete(URL + "/" + game);
    }
}
