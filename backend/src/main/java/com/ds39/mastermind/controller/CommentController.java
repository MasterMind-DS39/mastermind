package com.ds39.mastermind.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ds39.mastermind.model.Comment;
import com.ds39.mastermind.service.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public Comment addComment(@RequestBody Map<String, String> req) {
        Long postId = Long.parseLong(req.get("postId"));
        Long userId = Long.parseLong(req.get("userId"));
        String content = req.get("content");
        return commentService.addComment(userId, postId, content);
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsForPost(@PathVariable Long postId) {
        return commentService.getCommentsForPost(postId);
    }
}
